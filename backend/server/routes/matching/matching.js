const router = require("express").Router();
const pool = require("../../db");
const matchingSystem = require("../../matching/matchable").AvailablePersons;
const Mentee = require("../../matching/matchable").Mentee;
const Flag = require("../../matching/matchable").Flag;
                                     
router.get("/matching/:userid", async (req, res, next) => {
    try{ 

        //const userid = req.params.userID;
        const userid = await pool.query("SELECT userid FROM users WHERE name = 'Jimothy Bobson'") //or name = 'Your Father'")
        .then(async result => {
            return result.rows[0]["userid"];
        }, 
            result => {console.log("No such user exists")});
        const flag = new Flag(userid);
        matchingSystem.addMentee(flag);
        await pollFlag(flag, res);
    }catch(err){
        console.log(err);
        res.status(500).send("500: Server Error");
    }

});

async function pollFlag(flag, res){
    if(!flag.isFlagSet()){
        setTimeout(pollFlag, 0, flag, res);
    }
    else{
        return;
    }
}

module.exports = router;