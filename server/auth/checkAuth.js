const jwt = require('jsonwebtoken');
const tokens = require('./tokens');

async function checkAuth(req, res, next) {
    const token = req.body.accessToken;
    
    var userInfo;
    try {
        userInfo = await tokens.decodeAccessToken(token);
    } catch (err) {
        if (err.name === 'InvalidTokenError') {
            //Send failure response to frontend
            req.status(401).json(err);
        } else if (err.name === 'AccessTokenNotFoundError') {
            //Send failure response to frontend
            req.status(401).json(err);
        } else {
            //Crash appropriately
            throw err;
        }
    }

    req.userInfo = userInfo;

    next();
}