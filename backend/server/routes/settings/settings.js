const router = require("express").Router();
const bcrypt = require('bcryptjs');
const pool = require('../../db');
const userInteractions = require('../../interactions/users');
const checkAuth = require('../../auth/checkAuth');
const notify = require('../../interactions/notifications');
const { restart } = require("nodemon");
const { route } = require("../homepage");


router.get("/api/v1/settings/:userID", async (req,res) => {

});


router.post("/feedback", checkAuth, async (req,res, next) => {
    try{    
        
        const rating = req.body.rating; //PLACEHOLDER 
        const feedback = req.body.feedback;
        console.log("rating: " + rating + "feedback" + feedback);
        
        await pool.query("INSERT INTO appFeedback VALUES(DEFAULT, $1, $2)", [rating, feedback]);

    }catch(err){
        res.status(500).json(err);
        next()
    }
    res.send("success");
    next();
});

router.get("/notifications", checkAuth, async (req, res, next) => {
    try{
        const userid = req.userInfo.userID;        
        const notifications = [];

        const results = await pool.query("SELECT * FROM notifications WHERE userID = $1 AND dismissed = FALSE", [userid]);

        for(let i = 0; i < results.rowCount; ++i){
            row = results.rows[i];
            let notif = {
                notificationID: row.notificationid,
                userID: userid,
                text: row.msg,
                time: row.timecreated,
            }

            notifications.push(notif);
        }
        res.json(notifications);
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }
});

router.post("/password", checkAuth, async(req, res, next) => {
    try{
        let userid = req.userInfo.userID;
        let oldPassword = req.body.old;
        let newPassword = req.body.new;

        const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);

        const hash = result.rows[0].password;

        let isPassCorrect = await bcrypt.compare(oldPassword, hash);

        if(isPassCorrect){
            const newHash = await bcrypt.hash(newPassword, userInteractions.saltRounds);
            await pool.query("UPDATE users SET password = $1 WHERE userid = $2", [newHash, userid]);
        }
        else{
            throw {name: "InvalidPasswordError", message: "Invalid Password"}
        }
        res.send("success");
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }
    
});


router.post("/email", checkAuth, async(req, res, next) => {
    try{
        let userid = req.userInfo.userID;
        let password = req.body.password;
        let newEmail = req.body.newemail;

        await changeUserInfo(userid, password, "email", newEmail);
        
        res.send("success");
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }
    
});

async function changeUserInfo(userid, password, field, newInfo){
    try{
        const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);

        const hash = result.rows[0].password;
        let isPassCorrect = await bcrypt.compare(password, hash);

        if(isPassCorrect){
            await pool.query("UPDATE users SET " + field + " = $1 WHERE userid = $2", [newInfo, userid]);
        }
        else{
            throw {name: "InvalidPasswordError", message: "Invalid Password"}
        }
    } catch(err){
        throw err;
    }
}

module.exports = router;