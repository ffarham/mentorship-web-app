const router = require("express").Router();
const userInteractions = require('../interactions/users');
const tokens = require('../auth/tokens')
const pool = require('../db');

router.get("/login", async (req, res, next) => {

});

router.post("/login", async (req, res, next) => {
    //Pull out user info from request
    const userEmail = req.email;
    const userPassword = req.password;
    const userType = req.userType;

    try {
        //Validate the email and password
        if (userInteractions.checkEmailAndPassword(userEmail, userPassword)) {
            //Pull user info from database
            const userInfo = userInteractions.getUserInfoFromEmail(userEmail);

            //Generate tokens
            const accessToken = tokens.generateAccessToken(userInfo.userID, userType);
            const refreshToken = tokens.generateRefreshToken(userInfo.userID, userType);

            //Format and send response
            var responseObject = userInfo;
            responseObject.accessToken = accessToken;
            responseObject.refreshToken = refreshToken;

            res.json(responseObject);
        } else {
            //Throw an error if the password doesn't match
            res.status(500).json({name: 'LoginFailureError', message: 'Email and password do not match'});
        }
    } catch (err) {
        //Throw an error if the user doesn't exist in the database
        if (err.name === 'UserNotFoundError') {
            res.status(500).json(err);
        } else {
            throw err;
        }
    } finally { next(); }
});

const deleteTokensQuery = 'DELETE FROM authToken WHERE userID = $1'

router.post("/logout", async (req, res, next) => {
    const userID = req.body.userID;
    await pool.query(deleteTokensQuery, [userID]);
    res.send('Success!');
})
