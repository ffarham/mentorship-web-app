const router = require("express").Router();
const pool = require("../../db");
const matchingSystem = require("../../matching/matchable").pairMatching;
const Mentee = require("../../matching/matchable").Mentee;
const Flag = require("../../matching/matchable").Flag;
                                     
router.get("/matching/:userid", async (req, res, next) => {
    try{ 

        const userid = req.params.userid;
        console.log("userid: " + userid);
        
        const flag = new Flag(userid);
        matchingSystem.addMentee(flag);
        await pollFlag(flag, res);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }

});

async function pollFlag(flag, res){
    if(!flag.isFlagSet()){
        setTimeout(pollFlag, 0, flag, res);
    }
    else{
        if(flag.getFlag() === 1){
            let JSONString = await makeJSONList(flag.getMentorList());
            console.log("Final JSON string: " + JSONString);
            res.send(JSONString);
        }
        else{
            let err = flag.getError();
            console.log("flag error: " + err);
            res.status(500).send(err.message);
        }
    }
}

async function makeJSONList(mentorList){
    let JSONString = "[";
    let i = 0;
    for(i; i < mentorList.length; ++i){
        JSONString += mentorList[i].toJSON() + ",";
    }
    return JSONString;
}

module.exports = router;