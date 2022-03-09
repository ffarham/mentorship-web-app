//Process all matchable mentors and mentees
const pool = require('../db');

/*This needs to include mentors not in the mentoring table*/

const mentorQuery = "" +
"SELECT userid, name, businessarea, email, menteeNum FROM " + 
"(SELECT userid, name, CASE WHEN menteeNum is null THEN 0 ELSE menteeNum END, businessarea, email FROM users " + 
        "LEFT JOIN (SELECT COUNT(mentorid) menteeNum,  mentorid FROM mentoring GROUP BY mentorid) mentors " + 
        "ON userid = mentors.mentorid) mentoringCount " + 
            "JOIN mentor ON mentor.mentorid = mentoringCount.userid WHERE menteeNum < 5";


const menteeQuery = "" + 
"SELECT userid, name, businessarea, email FROM (" + 
"SELECT userid, name, businessarea, email FROM users " +
"LEFT OUTER JOIN (SELECT COUNT(menteeID) num, menteeID FROM " +
    "mentoring GROUP BY menteeID HAVING COUNT(menteeID) < 10) mentees ON userid = mentees.menteeID) users WHERE userid = $1";

const matchingInterestQuery = "" +
"select menteeInterests.userid as menteeid, mentorInterests.userid as mentorid, menteeInterests.interest as commonInterest, menteeInterests.ordering as menteeRank, mentorInterests.ordering as mentorRank from " +  
"(select mentees.userid, mentees.name, interest.interest, interest.ordering from " + 
"(select userid, name FROM users join mentee on userid = menteeid) mentees " + 
    "join interest " + 
    "on mentees.userid = interest.userid) menteeInterests " + 
        "join (select mentors.userid, mentors.name, interest.interest, interest.ordering from " + 
        "(select userid, name FROM users join mentor on userid = mentorid) mentors " + 
            "join interest " + 
            "on mentors.userid = interest.userid) mentorInterests " + 
        "ON menteeInterests.interest = mentorInterests.interest";

const mentoringPairs = "" + 
"SELECT menteeid, mentorid FROM mentoring";

const userInterests = "SELECT interest, ordering FROM interest WHERE userid = $1 AND kind = $2";

const flagQueue = [];
let menteeFlags = [];

const pollLimit = 3;
let pollCount = 0;

const maxMentees = 5;
const maxInterests = 5;
const worstRanking = maxInterests;

let menteeMentorMap = new Map();

class Tuple {
    constructor(first, second){
        this.first = first;
        this.second = second;
    }
    toString(){
        return "(" + this.first + ", " + this.second+ ")";
    }
    toJSON(){
        let jsonString = `{"first":"${this.first}","second":"${this.second}"}`;
        return jsonString;
    }
}

class Flag { 
    constructor(menteeid){
        this.flag = 0;
        this.menteeid = menteeid;
        this.mentorList = [];
        this.err = null;
    }
    setFlag(val){
        this.flag = val;
    }
    getFlag(){
        return this.flag;
    }
    isFlagSet(){
        return this.flag != 0;
    }
    getMenteeID(){
        return this.menteeid;
    }
    setMentorList(mentorList){
        this.mentorList = mentorList;
    }
    getMentorList(){
        return this.mentorList;
    }
    setError(err){
        this.err = err;
    }
    getError(){
        return this.err;
    }
}

class User {
    constructor(userid, name, bArea, email, interests){
        this.userid = userid;
        this.name = name;
        this.bArea = bArea;
        this.email = email;
        this.interests = interests;
        this.interestMap = new Map();
        if(interests != null){
            for(let i = 0; i < interests.length; ++i){
                this.interestMap.set(interests[i].second, null);
            }
        }
    }
    toString(){
        let str = "[";
        if (this.interests.length > 0){
            str += this.interests[0];
            for(let i = 1; i < this.interests.length; ++i){
                str +=  ", " + this.interests[i];
            }
        }
        str += "]";
        return "[" + this.userid + ", " + this.name + ", " + this.bArea + ", " + this.email + ", " +  "," + str + "]";
    }
    toJSON(){
        let keys = Object.keys(this);
        let jsonString = "{";
        for(let i = 0; i < keys.length-3; ++i){
            jsonString += `"${keys[i]}":"${this[keys[i]]}",`;
        }

        jsonString +=`"interests": [`;
        let i = 0;
        for(i; i < this.interests.length-1; ++i){
            jsonString += this.interests[i].toJSON() + ",";
        }
        jsonString += this.interests[i].toJSON();

        jsonString += "]";
        jsonString += "}";
        
        return jsonString;
    }
}

class Mentee extends User{
   constructor(userid, name, bArea, email, interests){
       super(userid, name, bArea, email, interests);
       this.aTable = new Map();
   }
   addMentor(mentor){
    this.aTable.set(mentor, null);
   }
}

class Mentor extends User{
    constructor(userid, name, bArea, email, interests, menteeNum){
        super(userid, name, bArea, email, interests);
        this.menteeNum = menteeNum;
    }
}

async function getInterests(userid, kind){
    let interests = undefined;
    try{
        interests = await pool.query(userInterests, [userid, kind]);
    } catch(err){
        throw err;
    }
    if(interests.rowCount === 0){
        throw {name: "InterestsNotFoundError", message: "Could not find user's interests"};
    }

    let interestArray = new Array();
    for(let j = 0; j < interests.rowCount; ++j){
        interestArray.push(new Tuple(interests.rows[j]["ordering"], interests.rows[j]["interest"]));
    }
    interestArray.sort((first, second) => { return first.first - second.first});
    return interestArray;
}

async function createMenteeObj(menteeID){
    let menteeResults = null;
    try{
        menteeResults = await pool.query(menteeQuery, [menteeID])
    } catch(err) {
        throw err;
    }
    if(menteeResults.rowCount === 0){
        throw {name: 'MenteeNotFoundError', message: 'Mentee unavailable!'};
    }

    let rows = menteeResults.rows;
    let interests = null;
    try{
        interests = await getInterests(rows[0]["userid"], "mentee")
    } catch(err){
        throw(err);
    }
    let mentee = new Mentee(menteeID, rows[0]["name"], rows[0]["businessarea"], rows[0]["email"], interests);
    return mentee;
}

async function getAvailableMentors(){
    let mentors = [];

    let mentorResults = null
    try{
        mentorResults = await pool.query(mentorQuery);
    } catch(err){
        throw(err);
    }
    if(mentorResults.rowCount === 0){
        throw {name: 'NoAvailableMentorsError', message: 'No mentors available!'}
    }
    let rows = mentorResults.rows;
    for(let i = 0; i < mentorResults.rowCount; ++i){
        let interests = null 
        try{
            interests = await getInterests(rows[i]["userid"], "mentor");
        } catch(err){
            throw(err);
        }
        mentors.push(new Mentor(rows[i]["userid"], rows[i]["name"], rows[i]["businessarea"], rows[i]["email"], interests, rows[i]["menteenum"])); 
    }
    return mentors;
}

async function createMentorList(flag, mentors){
    let tempList = [];
    for(let i = 0 ; i < mentors.length; ++i){
        tempList.push(mentors[i].second);
    }
    flag.setMentorList(tempList);
}

async function createMenteeMentorMap(){
    let map = new Map();
    let result = null;
    try{
         result = await pool.query(matchingInterestQuery);
    } catch(err){
        throw(err);
    }
                    
    for(let i = 0; i < result.rowCount; ++i){
        let row = result.rows[i];
        let newEntry = new Tuple(row["commoninterest"], new Tuple(row["menteerank"], row["mentorrank"]));
        if(!map.has(result.rows[i]["menteeid"])){
            let mentorMap = new Map();
            let interestArray = [newEntry];
            mentorMap.set(row["mentorid"], interestArray);
            map.set(row["menteeid"], mentorMap);
        }
        else{
            let mentorMap = map.get(row["menteeid"]);
            if(!mentorMap.has(row["mentorid"])){
                mentorMap.set(row["mentorid"], [newEntry]);
            } else{
                mentorMap.get(row["mentorid"])
                .push(newEntry);
            }
        }
    }
    return map;
}
 
async function rankFormula(rank, numMatches, numMentees){
    return rank - (numMatches + (maxMentees - numMentees))/(maxInterests + maxMentees);
} 

async function calculateRanking(mentee_T, mentor){
    let rank = worstRanking;

    
    let commonInterestTuples = menteeMentorMap.get(mentee_T.first.userid).get(mentor.userid);
    console.log(commonInterestTuples);
    for(let i = 0; i < commonInterestTuples.length; ++i){
        //Check if the mentee's ranking of an interest is lower than the current rank
        if(commonInterestTuples[i].second.first < rank){
            rank = commonInterestTuples[i].second.first;
        } 
    }

    rank = rankFormula(rank, commonInterestTuples.length, mentor.menteeNum);
    return rank;
}

async function getCurrentPairs(){
    let rows = null;
    
    try{ 
        rows = await pool.query(mentoringPairs); 
    } catch(err){
        throw(err);
    }
    let pairMap = new Map();

    for(let i = 0; i < rows.length; ++i){
        if(!pairMap.has(rows[i]["menteeid"])){
            let mentorMap = new Map();
            mentorMap.set(rows[i]["mentorid"], null);
            pairMap.set(rows[i]["menteeid"], mentorMap);
        } else{
            pairMap.get(rows[i]["menteeid"]).set(rows[i]["mentorid"], null);
        }
    }
    return pairMap;
}

async function setErrorFlags(err){
    for(let i = 0; i < menteeFlags.length; ++i){
        menteeFlags[i].setFlag(-1);
        menteeFlags[i].setError(err);
    }
}


var pairMatching = {
async addMentee(flag){
    flagQueue.push(flag);
},                  
async pollMatching(){
    console.log("pollCount: " + pollCount + " queue length:" + flagQueue.length);
    ++pollCount;      
    if((flagQueue.length > 2 || pollCount === pollLimit) && flagQueue.length > 0){
        pollCount = 0;
        try {
            await this.createMatches(flagQueue.splice(0, flagQueue.length));
        } catch(err) {
            setErrorFlags(err);
        }
        menteeFlags = [];
    }
    if(pollCount === pollLimit) pollCount = 0;    
},
async createMatches(flagList){
    menteeFlags = flagList;
    const mentees =  []; 
    let mentors = null;
    let currentPairs = null;
    try {
        menteeMentorMap = await createMenteeMentorMap();

        for(let i = 0; i < menteeFlags.length; ++i){
            mentees.push( await createMenteeObj(menteeFlags[i].getMenteeID()));//createMenteeObj(userid);
        }
        mentors =  await getAvailableMentors();
        currentPairs = await getCurrentPairs();
    } catch(err){
        console.log(err.message);
        throw(err);
    }
    console.log("mentors: " + mentors);
    //console.log("mentees: " + mentees);

    let assignedMentors = 0;
    
    const menteeArray = new Array();
    for(let i = 0; i < mentees.length; ++i){
        //console.log(mentees[i].name + ": " + Array.from(mentees[i].interestMap));
        menteeArray.push(new Tuple(mentees[i], []));
    }

    
    /*const mentors = new Array();
    for(let i = 0; i < mentors.length; ++i){
        mentors.push(mentors[i]);
    }*/

    /* MIGHT BE A FEW PROBLEMS WITH REMEMBERING MENTOR INDICES IN MENTEEARRAY; CTRL+F mentor.second and remove
    any instance of mentor.second.first or mentor.second.second*/
    //Rounds
    /*
    In each round, for each mentor, for each mentee check if the mentee has an interest the 
    mentor also has. If so, check the ranking and see if this ranking is higher than that stored
    for another mentee (or maybe the same mentee) for the mentor. If so, store the ranking, the index
    of the ment and the 
    mentee's array of mentors (for easy insertion later). 
    Store the mentor in the mentee's list. 
    Repeat with every other mentor
    Repeat until there are no unassigned mentors remaining.
    */
    do{
        for(let i = 0; i < mentors.length; ++i){
            let mentor = mentors[i];
            let topMentee = new Tuple(worstRanking, null);
            for(let j = 0; j < menteeArray.length; ++j){

                let mentee_T = menteeArray[j];
                console.log("considering mentee: " + mentee_T.first.name + " and mentor: " + mentor.name);
                console.log("mentee's bArea: " + mentee_T.first.bArea, " mentor's: " + mentor.bArea);
                console.log("number of common interests: " + 
                await menteeMentorMap.get(mentee_T.first.userid).get(mentor.userid));
                  
                //If the mentor-mentee pair has already been considered, do not do so again
                if(mentee_T.first.aTable.has(mentor)){
                    console.log("already assigned");
                    continue;
                }
                //Do not attempt to match mentees and mentors with the same business area
                if(mentee_T.first.bArea === mentor.bArea || mentee_T.first.userid === mentor.userid){
                    mentee_T.first.aTable.set(mentor, null);
                    ++assignedMentors;
                    continue;    
                }
                if(currentPairs.has(mentee_T.first.userid)){
                    if(currentPairs.get(mentee_T.first.userid).has(mentor.userid)){
                        mentee_T.first.aTable.set(mentor, null);
                        ++assignedMentors;
                        continue;
                    }
                }
                
                //Check for common interests between the mentor and mentee
                //If the mentor's ranking of a common interest is lower (= better) than a previous 
                //common interest between iteself and some mentee, record this ranking and the index
                //of the mentee as a tuple and store the tuple.
                //let commonInterests = 0;
                if(menteeMentorMap.get(mentee_T.first.userid).has(mentor.userid)){
                    let commonInterests = menteeMentorMap.get(mentee_T.first.userid).get(mentor.userid);
                    console.log("got here");
                    for(let k = 0; k < commonInterests.length; ++k){
                        console.log("interests: " + commonInterests[k].first + " interest ranking: " + commonInterests[k].second.second);
                        if(commonInterests[k].second.second < topMentee.first){
                            topMentee = new Tuple(commonInterests[k].first, j);
                        }
                    }
                }
                else{
                    console.log("no common interests");
                    mentee_T.first.aTable.set(mentor, null);
                    ++assignedMentors;
                }
            }
            //Assign the mentor to a mentee. Rank the mentor by their interest which is ranked
            //highest by the mentee.
            //Assign the mentor's probably delete this. 
            if(topMentee.second != null){
                mentee_T = menteeArray[topMentee.second];
                console.log("Try to assign mentor: " + mentor.name + " to: " + mentee_T.first.name);
                mentee_T.first.aTable.set(mentor, null);
                ++assignedMentors;
                //Find the ranking that the mentee gives the mentor, which is the highest ranking 
                //given to an interest that the mentor has by the mentee.
                let rank = null 
                try{
                    rank = await calculateRanking(mentee_T, mentor);
                } catch(err){ throw err}
                //If the mentee has less than 5 mentors assigned to them, add the new mentor
                if(mentee_T.second.length < 5) {
                    mentee_T.second.push(new Tuple(rank, mentor));
                    console.log("Assigned");
                }
                //Otherwise, check if the new mentor is better ranked than one of 
                //the existing assignments and if so, replace the old assignment
                else{
                    let tempIndex = -1;
                    let tempRank = rank;
                    for(let p = 0; p < 5; ++p){
                        if(mentee_T.second[p].first > tempRank){
                            tempIndex = p;
                            tempRank = mentee_T.second[p].first
                        }
                    }
                    if(tempIndex != -1){
                        console.log("Swapping mentor " /*+ mentors[mentee_T.second[tempIndex].second.first].name + 
                            */ + "for: " + mentor.name);
                        mentee_T.second[tempIndex] = new Tuple(rank, mentor);
                    }
                }
            }
        }
        console.log("assignedMentors = " + assignedMentors);
        console.log("target: " + mentors.length);
        
    }while(assignedMentors != menteeArray.length * mentors.length);

    console.log("Finished!");
    //Sort the result
    for(let i = 0; i < menteeArray.length; ++i){
        console.log(menteeArray[i].first.name + ": ");
        console.log(menteeArray[i].second[0].second.name);
        menteeArray[i].second.sort();
        
        try{await createMentorList(menteeFlags[i], menteeArray[i].second);}
        catch(err) {throw err;}
        
        menteeFlags[i].setFlag(1);
    }
    for(let i = 0; i < menteeArray.length; ++i){
        console.log(menteeArray[i].first + ":");
        for(let j = 0; j < menteeArray[i].second.length; ++j){
            console.log(menteeArray[i].second[j].second.name + ": " + 
                menteeArray[i].second[j].first);
        }
    }
    menteeArray.shift(0, menteeArray.length + 1);
},
}

module.exports = {pairMatching, Mentee, Flag};