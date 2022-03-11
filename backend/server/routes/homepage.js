const router = require("express").Router();
const pool = require("../db");
const available = require('../matching/matchingSystem').AvailablePersons;
const Flag = require('../matching/matchingSystem').Flag;
const Mentee = require('../matching/matchingSystem').Mentee;
// ADD ROUTES HERE

// e.g.
// router.post("sendData...", async (req, res) => {
//     try{

//     }catch(err){
//         console.log(err);
//         res.status(500).send("Server error")
//     }
// });
const findPasswordQuery = 'SELECT password FROM users;'

router.get("/", async (req, res) => {
    res.redirect("/home");
});

router.get("/home", async (req, res) =>{
    console.log("/home\n" + req.body);
    try{
        const result = await pool.query(findPasswordQuery);
        if(result.rowCount === 0){
            throw {name:'Error :('};
        }    
        //processUser();
        //"This is the homepage" + 
        res.send(result.rows);
    }catch(err){
        console.log(err);
        res.status(500).send("500: Server Error");
    }

    
});

/*async function processUser(){
let resultsArray = [];
    console.log("got here");
    let userid = await pool.query("SELECT userid FROM users WHERE name = 'Jimothy Bobson'") //or name = 'Your Father'")
        /*.then(async result => {
            for(let i = 0; i < result.rowCount; ++i){
                let mentee = new Mentee(result.rows[i]["userid"], null, null, null, null);
                console.log("mentee userid: " + mentee.userid);
                let flag = new Flag(mentee);
                console.log("flag userid: " + flag.getMentee().userid);
                available.addMentee(flag);
            }
        },*/
        /*
        .then(async result => {
            return result.rows[0]["userid"];
        }, 
            result => {console.log("No such user exists")});

    sendFlag(userid);

    console.log("end me");
}*/
/*
async function sendFlag(userid){
    const flag = new Flag(userid);
    console.log("row result: " + userid);
    console.log("intitial menteeid: " + flag.getMenteeID());
    available.addMentee(flag);
    console.log("waiting");
    await pollFlag(flag);
    console.log("Recieved results:");
    let mentorList = flag.getMentorList();
    for(let i = 0; i < mentorList.length; ++i){
        console.log(mentorList[i].name);
    }   
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
*/
module.exports = router;