const jwt = require('jsonwebtoken');
const tokens = require('./tokens');

async function checkAuth(req, res, next) {
    //TODO: Check for access token field

    next();
}