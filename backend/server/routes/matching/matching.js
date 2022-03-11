const router = require("express").Router();
const pool = require("../../db");
const matchingSystem = require("../../matching/matchable").pairMatching;
const Mentee = require("../../matching/matchable").Mentee;
const Flag = require("../../matching/matchable").Flag;
                     
/**
 * Submit a mentee to the matching algorithm to match them with some mentors
 */
router.get("/matching/:userid", async (req, res, next) => {
    try{ 

        const userid = req.params.userid;
        console.log("userid: " + userid);
        
        //Flag used to to check whether the matching algorithm has finished with the mentee
        //See /backend/server/matching/matchable.js for the class definition
        const flag = new Flag(userid);
        matchingSystem.addMentee(flag);
        //Wait for the matching algorithm
        await pollFlag(flag, res);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }

});

/**
 * Check whether the matching algorithm has finished with the mentee
 * @param {Flag} flag the flag for the mentee 
 * @param {*} res the HTTP response sent to the user
 */
async function pollFlag(flag, res){
    //Periodically check whether the flag's flag attribute has been 
    //set by the matching system, which indicates that the mentee has been
    //matched with some mentors.
    if(!flag.isFlagSet()){
        setTimeout(pollFlag, 0, flag, res);
    }
    else{
        if(flag.getFlag() === 1){
            //If the matching was successful then send JSON data on the mentors the system
            //has found for the mentee
            let JSONString = await makeJSONList(flag.getMentorList());
            console.log("Final JSON string: " + JSONString);
            res.send(JSONString);
        }
        else{
            //Send an error message
            let err = flag.getError();
            console.log("flag error: " + err);
            res.status(500).send(err.message);
        }
    }
}

/**
 * Convert the list of mentor data stored in the flag to a JSON string to send in the response.
 * @param {Array} mentorList The list of mentors
 * @returns A string of JSON data
 */
async function makeJSONList(mentorList){
    let JSONString = "[";
    let i = 0;
    for(i; i < mentorList.length; ++i){
        JSONString += mentorList[i].toJSON() + ",";
    }
    return JSONString;
}

module.exports = router;