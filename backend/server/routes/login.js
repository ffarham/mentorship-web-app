const router = require("express").Router();
const userInteractions = require('../interactions/users');
const tokens = require('../auth/tokens')
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');


const deleteTokensQuery = 'DELETE FROM authToken WHERE userID = $1';

//Log a user in
router.post("/login", async (req, res, next) => {
    console.log("/login\n" + req.body)
    //Pull out user info from request
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const userType = req.body.userType;

    try {
        //Validate the email and password
        if (await userInteractions.checkEmailAndPassword(userEmail, userPassword)) {
            //Pull user info from database
            const userInfo = await userInteractions.getUserInfoFromEmail(userEmail);

            //Delete any tokens associated with this user
            await pool.query(deleteTokensQuery, [userInfo.userID]);

            //Generate tokens
            const accToken = await tokens.generateAccessToken(userInfo.userID, userType);
            const refToken = await tokens.generateRefreshToken(userInfo.userID, userType);

            //Throw an error if the user isn't a userType
            //Check if user is present in the appropriate database table
            var result;
            if (userType === 'mentee') {
                result = await pool.query("SELECT * FROM mentee WHERE menteeID = $1", [userInfo.userID]);
            } else if (userType === 'mentor') {
                result = await pool.query("SELECT * FROM mentor WHERE mentorID = $1", [userInfo.userID]);
            }

            //Throw an error if the query didn't find anything
            if (result.rowCount === 0) {
                res.status(500).json({name: 'LoginFailureError', message: `User is not a ${userType}`});
                console.log({name: 'LoginFailureError', message: `User is not a ${userType}`});
            }

            //Format and send response
            const responseObject = {
                userID: userInfo.userID,
                userType: userType,
                accessToken: accToken,
                refreshToken: refToken,
            };

            res.json(responseObject);
        } else {
            //Throw an error if the password doesn't match
            res.status(500).json({name: 'LoginFailureError', message: 'Email and password do not match'});
            console.log({name: 'LoginFailureError', message: 'Email and password do not match'});
        }
    } catch (err) {
        //Throw an error if the user doesn't exist in the database
        if (err.name === 'UserNotFoundError') {
            res.status(500).json({name: 'LoginFailureError', message: `${userEmail} not found`});
            console.log({name: 'LoginFailureError', message: `${userEmail} not found`});
        } else {
            console.log({name: 'LoginFailureError', message: `${userEmail} not found`});
        }
    } finally { next(); }
});

//Log a user out
router.post("/logout", checkAuth, async (req, res, next) => {
    console.log("/logout\n" + req.body)
    try {
        const userID = req.userInfo.userID;
        await pool.query(deleteTokensQuery, [userID]);
        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

    next();
})

module.exports = router;
