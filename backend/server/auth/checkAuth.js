const jwt = require('jsonwebtoken');
const tokens = require('./tokens');

async function checkAuth(req, res, next) {
    const token = req.get('x-auth-token');
    
    var userInfo;
    try {
        userInfo = await tokens.decodeAccessToken(token);
    } catch (err) {
        if (err.name === 'InvalidTokenError') {
            //Send failure response to frontend
            res.status(403).json(err);
            next('route');
        } else if (err.name === 'AccessTokenNotFoundError') {
            //Send failure response to frontend
            res.status(403).json(err);
            next('route');
        } else {
            //Crash appropriately
            throw err;
        }
    }

    req.userInfo = userInfo;

    next();
}

module.exports = checkAuth;