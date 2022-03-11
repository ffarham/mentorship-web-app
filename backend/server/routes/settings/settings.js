const router = require("express").Router();
const bcrypt = require('bcryptjs');
const pool = require('../../db');
const userInteractions = require('../../interactions/users');
const checkAuth = require('../../auth/checkAuth');
const notify = require('../../interactions/notifications');
const { restart } = require("nodemon");
const { route } = require("../homepage");


// Recieves and stores a user's feedback on the app overall
router.post("/feedback", checkAuth, async (req,res, next) => {
    try{    
        
        const rating = req.body.rating; //PLACEHOLDER 
        const feedback = req.body.feedback;
        console.log("rating: " + rating + "feedback" + feedback);
        
        await pool.query("INSERT INTO appFeedback VALUES(DEFAULT, $1, $2)", [rating, feedback]);

    }catch(err){
        res.status(500).json(err);
        next();
    }
    res.send("success");
    next();
});

// Allows a user to change their password
router.post("/password", checkAuth, async(req, res, next) => {
    try{
        let userid = req.userInfo.userID;
        let oldPassword = req.body.password;

        const newHash = await bcrypt.hash(req.body.newpassword, userInteractions.saltRounds);

        await changeUserInfo(userid, oldPassword, "password", newHash);
        res.send("success");
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }
    
});

// Allows a user to change their email
router.post("/email", checkAuth, async(req, res, next) => {
    try{
        await changeUserInfo(req.userInfo.userID, req.body.password, "email", req.body.newemail);

        res.send("success");
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }
    
});

// Allows a user to change their department
router.post("/department", checkAuth, async(req, res, next) => {
    try{
        await changeUserInfo(req.userInfo.userID, req.body.password, "businessarea",  req.body.newdepartment);
    }catch(err){
        res.status(500).json(err);
        next();
    }
    res.send("success");
    next();
});

// Allows a user to change their bio
router.post("/bio", checkAuth, async(req, res, next) => {
    try{
        await pool.query("UPDATE users SET bio = $1 WHERE userid = $2", [req.body.bio, req.userInfo.userID])
        res.send("success");
        next();
    } catch(err) {
        res.status(500).json(err);
        next();
    }
})

/**
 * Updates a users profile with some new information that the user has entered.
 * The user must give their password; if it is correct their information will be updated, else
 * no changes are made.
 * @param {string} userid userid of a user who wishes to change their information
 * @param {*} password Passwor of the user
 * @param {*} field Name of the field in the `users` table to be altered 
 * @param {*} newInfo The new information
 */
async function changeUserInfo(userid, password, field, newInfo){
    try{
        console.log("new: " + newInfo);
        const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);

        const hash = result.rows[0].password;
        let isPassCorrect = await bcrypt.compare(password, hash);

        console.log(isPassCorrect);

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

/**
 * Deletes a user's profile
 */
router.delete("/deleteProfile", checkAuth, async(req, res, next) => {
    try{
        await pool.query("DELETE FROM users WHERE userid = $1", [req.userInfo.userID]);
    } catch(err){
        res.status(500).json(err);
        next();
    }
    res.send("success");
    next();
});

module.exports = router;