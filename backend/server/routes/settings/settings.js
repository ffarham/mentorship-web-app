const router = require("express").Router();
const bcrypt = require('bcryptjs');
const pool = require('../../db');
const userInteractions = require('../../interactions/users');
const checkAuth = require('../../auth/checkAuth');
const notify = require('../../interactions/notifications');


//Recieves and stores a user's feedback on the app overall
//Works
router.post("/feedback", checkAuth, async (req,res, next) => {
    console.log("/feedback\n" + req.body)
    try{    
        
        const rating = req.body.rating; //PLACEHOLDER 
        const feedback = req.body.feedback;
        console.log("rating: " + rating + "feedback" + feedback);
        
        await pool.query("INSERT INTO appFeedback VALUES(DEFAULT, $1, $2)", [rating, feedback]);

    }catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
    res.send("success");
    next();
});

// Allows a user to change their password
router.post("/password", checkAuth, async(req, res, next) => {
    console.log("/password\n" + req.body)
    try{
        let userid = req.userInfo.userID;
        let oldPassword = req.body.password;

        const newHash = await bcrypt.hash(req.body.newpassword, userInteractions.saltRounds);

        await changeUserInfo(userid, oldPassword, "password", newHash);
        res.send("success");
        next();
    }catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
    
});

// Allows a user to change their email
router.post("/email", checkAuth, async(req, res, next) => {
    console.log("/email\n" + req.body)
    try{
        await changeUserInfo(req.userInfo.userID, req.body.password, "email", req.body.newemail);

        res.send("success");
        next();
    }catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
    
});

// Allows a user to change their department
router.post("/department", checkAuth, async(req, res, next) => {
    console.log("/department\n" + req.body)
    try{
        await changeUserInfo(req.userInfo.userID, req.body.password, "businessarea",  req.body.newdepartment);
        res.send("success");
    }catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
    next();
});

// Allows a user to change their bio
//Works
router.post("/bio", checkAuth, async(req, res, next) => {
    console.log("/bio\n" + req.body)
    try{
        await pool.query("UPDATE users SET bio = $1 WHERE userid = $2", [req.body.bio, req.userInfo.userID])
        res.send("success");
        next();
    } catch(err) {
        res.status(500).json(err);
        next();
        console.log(err);
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
        console.log(field);
        console.log(newInfo);
        console.log(userid);
        if(await checkPassword(userid, password)){
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
router.post("/deleteProfile", checkAuth, async(req, res, next) => {
    try{
        if(await checkPassword(req.userInfo.userID, req.body.password)){
            await pool.query("DELETE FROM users WHERE userid = $1", [req.userInfo.userID]);
            res.send("success");
            next();
        }
        else{
            throw{name:"InvalidPasswordError", message: "Invalid Password"};
        }
    } catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
});

/**
 * Check if a user's password has been inputted correctly in order to change their settings
 * @param {string} userid The userid of the user 
 * @param {*} password The password the user has input
 * @returns true if password matches the user's actual password, false otherwise
 */
async function checkPassword(userid, password){
    let isPassCorrect = false;
    try{
        const result = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);
        const hash = result.rows[0].password;
        isPassCorrect = await bcrypt.compare(password, hash);
        console.log(isPassCorrect);
        
    } catch(err){
        throw(err);
    }
    return isPassCorrect;
}

//Gets the user's settings
router.get('/settings', checkAuth, async (req, res, next) => {
    try {
        const userInfoResult = await pool.query('SELECT * FROM users WHERE userID = $1', [req.userInfo.userID]);

        var userData = {
            name : userInfoResult.rows[0].name,
            email : userInfoResult.rows[0].email,
            department : userInfoResult.rows[0].businessarea,
            interests : [],
            bio : userInfoResult.rows[0].bio        
        }

        const interestsResult = await pool.query('SELECT interest FROM interest WHERE userID = $1 AND kind = $2', [req.userInfo.userID, req.userInfo.userType]);

        for (var i = 0; i < interestsResult.rowCount; i++) {
            userData.interests.push(interestsResult.rows[i].interest);
        }

        res.json(userData);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

module.exports = router;