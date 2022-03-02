const router = require("express").Router();
const matchingSystem = require("../../matching/matchable").AvailablePersons;
const Mentee = require("../../matching/matchable").Mentee;
const Flag = require("../../matching/matchable").Flag;
                                     
router.get("/api/v1/matching/:userID", (req, res, next) => {
    try{ 
        const mentee = new Mentee(req.params.userID, null, null, null, null);
        const flag = new Flag(mentee);
        matchingSystem.addMentee(flag);
    
        while(!flag.isFlagSet()){};
        res.send(flag.mentee);
    }catch(err){
        console.log(err);
        res.status(500).send("500: Server Error");
    }

});

module.exports = router;