const router = require("express").Router();
const tokens = require('../auth/tokens');

//Check a refresh token and issue new access and refresh tokens
router.post('/checkrefreshtoken', (req, res, next) => {
    console.log("/checkrefreshtoken\n" + req.body)
    //Pull the token from the request
    const refreshToken = req.body.refreshToken;

    //Decode the token
    tokens.decodeRefreshToken(refreshToken)
        .then((newTokens) => {
            res.json(newTokens);
            next();
        })
        .catch((err) => {
            //TODO: Catch errors in getUserFromRefreshToken, generateAccessToken, generateRefreshToken
            console.log(err);
            res.status(401).json(err);
            next();
        })
});

module.exports = router