//Process all matchable mentors and mentees
const pool = require('../db');

/*This needs to include mentors not in the mentoring table*/
/*const mentorQuery = "" +
"SELECT userid, name, businessarea, email FROM users " + 
"JOIN (SELECT COUNT(mentorid) num,  mentorid FROM " +  
    "mentoring GROUP BY mentorid HAVING COUNT(mentorid) < 5) mentors ON userid = mentors.mentorid";*/

const mentorQuery = "" +
"SELECT userid, name, businessarea, email FROM " + 
"(SELECT userid, name, CASE WHEN num is null THEN 0 ELSE num END, businessarea, email FROM users " + 
        "LEFT JOIN (SELECT COUNT(mentorid) num,  mentorid FROM mentoring GROUP BY mentorid) mentors " + 
        "ON userid = mentors.mentorid) mentoringCount " + 
            "JOIN mentor ON mentor.mentorid = mentoringCount.userid WHERE num < 5";


const menteeQuery = "" + 
"SELECT userid, name, businessarea, email FROM (" + 
"SELECT userid, name, businessarea, email FROM users " +
"JOIN (SELECT COUNT(menteeID) num, menteeID FROM " +
    "mentoring GROUP BY menteeID HAVING COUNT(menteeID) < 5) mentees ON userid = mentees.menteeID) users WHERE userid = $1";

const matchCountQuery = "" +
"select menteeid, mentorid, count(*) from " +
"(select menteeInterests.userid as menteeid, mentorInterests.userid as mentorid from " +
"(select mentees.userid, mentees.name, interest.interest from " +
"(select userid, name FROM users join mentee on userid = menteeid) mentees " +
    "join interest " + 
    "on mentees.userid = interest.userid) menteeInterests " +
        "join (select mentors.userid, mentors.name, interest.interest from " +
        "(select userid, name FROM users join mentor on userid = mentorid) mentors " +
            "join interest " + 
            "on mentors.userid = interest.userid) mentorInterests " +
        "ON menteeInterests.interest = mentorInterests.interest) interestMatches " +
            "GROUP BY menteeid, mentorid";


const userInterests = "SELECT interest, rnk FROM interest WHERE userid = $1 AND kind = $2";

const flagQueue = [];
let pollCount = 0;

class Tuple {
    constructor(first, second){
        this.first = first;
        this.second = second;
    }
    toString(){
        return "(" + this.first + ", " + this.second+ ")";
    }
    toJSON(){
        let keys = Object.keys(this);
        let jsonString = `{"first":"${this.first}","second":"${this.second}"}`;
        return jsonString;
    }
}

class Flag { 
    constructor(menteeid){
        this.flag = 0;
        this.menteeid = menteeid;
        this.mentorList = [];
    }
    setFlag(){
        this.flag = 1;
    }
    isFlagSet(){
        return this.flag == 1;
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
        //console.log(JSON.stringify(this.interests));
        //console.log(JSON.parse(JSON.stringify(this.interests)));
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

async function getInterests(userid, kind){
    const interests = await pool.query(userInterests, [userid, kind]);
    let interestArray = new Array();
    for(let j = 0; j < interests.rowCount; ++j){
        interestArray.push(new Tuple(interests.rows[j]["rnk"], interests.rows[j]["interest"]));
    }
    interestArray.sort((first, second) => { return first.first - second.first});
    return interestArray;
}

async function createMenteeObj(menteeID){
    const menteeResults = await pool.query(menteeQuery, [menteeID]);
    if(menteeResults.rowCount === 0){
        throw {name: 'MenteeUnavailableError', message: 'Mentee unavailable!'};
    }
    let rows = menteeResults.rows;
    let interests = await getInterests(menteeResults.rows[0]["userid"], "mentee");
    // interests.map(a => {return a}
    let mentee = new Mentee(menteeID, rows[0]["name"], rows[0]["businessarea"], rows[0]["email"], interests);
    console.log("JSON of: " + mentee.name);
    console.log(mentee.toJSON());
    console.log(JSON.parse(mentee.toJSON()).name + "\n\n");
    return mentee;
}

async function getAvailableMentors(){
    let mentors = [];

    const mentorResults = await pool.query(mentorQuery);
    if(mentorResults.rowCount === 0){
        throw {name: 'NoAvailableMentorsError', message: 'No mentors available!'}
    }
    let rows = mentorResults.rows;
    for(let i = 0; i < mentorResults.rowCount; ++i){
        let interests = await getInterests(rows[i]["userid"], "mentor");
        mentors.push(new User(rows[i]["userid"], rows[i]["name"], rows[i]["businessarea"], rows[i]["email"], interests)); 
    }
    return mentors;
}





var AvailablePersons = {
async addMentee(flag){
    flagQueue.push(flag);
},                    
async pollMatching(){
    console.log("pollCount: " + pollCount + " queue length:" + flagQueue.length);
    ++pollCount;      
    if((flagQueue.length > 1 || pollCount === 2) && flagQueue.length > 0){
        pollCount = 0;
        startTime = new Date();
        this.createMatches(flagQueue.splice(0, 2));
    }
    if(pollCount === 2) pollCount = 0;    
},
async createMatches(menteeFlags){
    const mentors = await getAvailableMentors();
    const mentees =  []; 
    
    console.log("got here");
    for(let i = 0; i < menteeFlags.length; ++i){
        console.log("menteeid: " + menteeFlags[i].getMenteeID());
        mentees.push( await createMenteeObj(menteeFlags[i].getMenteeID()));//createMenteeObj(userid);
    }

    console.log("mentors: " + mentors);
    console.log("mentees: " + mentees);

    let free = mentors.length;
    let assignedMentors = 0;

    const menteeArray = new Array();
    for(let i = 0; i < mentees.length; ++i){
        //console.log(mentees[i].name + ": " + Array.from(mentees[i].interestMap));
        menteeArray.push(new Tuple(mentees[i], []));
    }

    
    const mentorsToAssign = new Array();
    for(let i = 0; i < mentors.length; ++i){
        mentorsToAssign.push(new Tuple(mentors[i], false));
    }


    /* MIGHT BE A FEW PROBLEMS WITH REMEMBERING MENTOR INDICES IN MENTEEARRAY; CTRL+F mentor_T.second and remove
    any instance of mentor_T.second.first or mentor_T.second.second*/
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
        for(let i = 0; i < mentorsToAssign.length; ++i){
            //
            //if(mentorsToAssign)
            //if(mentorsToAssign[i].second == true) continue;
            let mentor_T = mentorsToAssign[i];
            let topMentee = new Tuple(7, null);
            for(let j = 0; j < menteeArray.length; ++j){
                if(menteeArray[j].first.aTable.has(mentor_T.first)){
                    console.log("already assigned");
                    continue;
                }
                let mentee_T = menteeArray[j];
                console.log("considering mentee: " + mentee_T.first.name + " and mentor: " + mentor_T.first.name);

                let commonInterests = 0;
                for(let k = 0; k < mentor_T.first.interests.length; ++k){
                    if(mentee_T.first.interestMap.has(mentor_T.first.interests[k].second)){
                        ++commonInterests;
                        console.log("Matching interest found");
                        console.log("interest ranking: " + mentor_T.first.interests[k].first);
                        if(mentor_T.first.interests[k].first < topMentee.first){ 
                            topMentee = new Tuple(mentor_T.first.interests[k].first, j);
                        }
                    }
                }
                if(commonInterests === 0) {
                    console.log("no common interests");
                    mentee_T.first.aTable.set(mentor_T.first, null);
                    ++assignedMentors;
                }
            }
            //Assign the mentor to a mentee. Rank the mentor by their interest which is ranked
            //highest by the mentee.
            //Assign the mentor's probably delete this. 
            if(topMentee.second != null){
                let rank = 6;
                mentee_T = menteeArray[topMentee.second];
                console.log("Try to assign mentor: " + mentor_T.first.name + " to: " + mentee_T.first.name);
                mentee_T.first.aTable.set(mentor_T.first, "it's cringe");
                ++assignedMentors;
                //Find the ranking that the mentee gives the mentor, which is the highest ranking 
                //given to an interest that the mentor has by the mentee.
                //If the mentee and mentor have no common interests the ranking is 6.
                for(let p = 0; p < mentee_T.first.interests.length; ++p){
                    if(mentor_T.first.interestMap.has(mentee_T.first.interests[p].second)){
                        if(mentee_T.first.interests[p].first < rank){
                            rank = mentee_T.first.interests[p].first;
                        }
                    }
                }
                //If the mentee has less than 5 mentors assigned to them, add the new mentor
                if(mentee_T.second.length < 5) {
                    mentee_T.second.push(new Tuple(rank, new Tuple(i, mentor_T.first)));
                    mentor_T.second = true;
                    console.log("Assigned");
                }
                //Otherwise, check if the new mentor is better ranked than one of 
                //the existing assignments and if so, replace the old assignment
                else{
                    let tempIndex = 0;
                    let tempRank = rank;
                    for(let p = 0; p < 5; ++p){
                        if(mentee_T.second[p].first > tempRank){
                            tempIndex = p;
                            tempRank = mentee_T.second[p].first
                        }
                    }
                    console.log("Swapping mentor " + mentorsToAssign[mentee_T.second[tempIndex].second.first].first.name + 
                            " for: " + mentor_T.first.name);
                    mentorsToAssign[mentee_T.second[tempIndex].second.first].second = false;
                    mentee_T.second[tempIndex] = new Tuple(rank, new Tuple(i, mentor_T.first));
                    mentor_T.second = true;
                }
            }
        }
        console.log("assignedMentors = " + assignedMentors);
        console.log("target: " + mentorsToAssign.length);
        
    }while(assignedMentors != menteeArray.length * mentorsToAssign.length);

    console.log("Finished!");
    //Sort the result
    for(let i = 0; i < menteeArray.length; ++i){
        menteeArray[i].second.sort();
        menteeFlags[i].setMentorList(menteeArray[i].second);
        menteeFlags[i].setFlag();
    }
    for(let i = 0; i < menteeArray.length; ++i){
        console.log(menteeArray[i].first + ":");
        for(let j = 0; j < menteeArray[i].second.length; ++j){
            console.log(menteeArray[i].second[j].second.second.name + ": " + 
                menteeArray[i].second[j].first);
        }
    }
    return menteeArray;
}


}

module.exports = {AvailablePersons, Mentee, Flag};