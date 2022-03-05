const tokens = require('./tokens');

async function checkAuth(req, res, next) {
    //Get access token from request header
    const token = req.headers['x-auth-token'];
    
    var userInfo;
    try {
        //Decode the access token
        userInfo = await tokens.decodeAccessToken(token);
    } catch (err) {
        //Catch errors:
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
            res.status(500).json(err);
            next('route');
        }
    }

    //Attach user info to the request object
    req.userInfo = userInfo;

    next();
}

module.exports = checkAuth;