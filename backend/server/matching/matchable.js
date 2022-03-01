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
"select userid, name, businessarea, email FROM (" + 
"SELECT userid, name, businessarea, email FROM users " +
"JOIN (SELECT COUNT(menteeID) num, menteeID FROM " +
    "mentoring GROUP BY menteeID HAVING COUNT(menteeID) < 5) mentees ON userid = mentees.menteeID) users WHERE userid = $1";

const userInterests = "SELECT interest, rnk FROM interest WHERE userid = $1 AND kind = $2";

class Tuple {
    constructor(first, second){
        this.first = first;
        this.second = second;
    }
    toString(){
        return "(" + this.first + ", " + this.second+ ")";
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
        for(let i = 0; i < interests.length; ++i){
            this.interestMap.set(interests[i].second, null);
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

async function createMenteeObj(userid){
    const menteeResults = await pool.query(menteeQuery, [userid]);
    if(menteeResults.rowCount === 0){
        throw {name: 'MenteeUnavailableError', message: 'Mentee unavailable!'};
    }
    let rows = menteeResults.rows;
    let interests = await getInterests(menteeResults.rows[0]["userid"], "mentee");
    // interests.map(a => {return a}
    let mentee = new Mentee(rows[0]["userid"], rows[0]["name"], rows[0]["businessarea"], rows[0]["email"], interests);
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
async createMatches(userids){
    const mentors = await getAvailableMentors();
    const mentees =  []; 
    
    for(let i = 0; i < userids.length; ++i){
        mentees.push(await createMenteeObj(userids[i]));//createMenteeObj(userid);
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
            //Assign the mentor's 
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
    for(let i = 0; i < menteeArray.length; ++i){
        console.log(menteeArray[i].first + ":");
        for(let j = 0; j < menteeArray[i].second.length; ++j){
            console.log(menteeArray[i].second[j].second.second.name + ": " + 
                menteeArray[i].second[j].first);
        }
    }
}


}

module.exports = AvailablePersons;