const jwt = require('jsonwebtoken');
const userInteractions = require('../database/interactions/users');

//Secret key for signing tokens
const TOKEN_SECRET = '4a6c48ca3d2730d1c77c2ff9fc89ebbd15b1943a13736f552921421820c9059fe2faea884c20aa510b08f85e5f140d014593b552ba4a1cc71fb4ae8fcb70d17f';

//Time to live for refresh tokens
const refreshTTL = '4800h';

//Time to live for access tokens
const accessTTL = '6h';

async function generateAccessToken(userID) {
    try {
        const token = await userInteractions.registerToken(userID, accessTTL, 'acc');
        return jwt.sign(token, TOKEN_SECRET, accessTTL);
    } catch (err) { throw err; }
}

async function generateRefreshToken(userID) {
    try {
        const token = await userInteractions.registerToken(userID, refreshTTL, 'ref');
        return jwt.sign(token, TOKEN_SECRET, refreshTTL);
    } catch (err) { throw err; }
}

async function decodeAccessToken(token) {
    //Decode the token
    var decoded;
    try {
        decoded = jwt.verify(token, TOKEN_SECRET);
    } catch(err) {
        throw {name: 'InvalidTokenError', message: 'Attemped to decode an invalid token.'};
    }
    
    //Get user info
    var userInfo;
    try {
        userInfo = await userInteractions.getUserFromToken(decoded);
    } catch(err) { throw err; }

    return userInfo;
}

async function decodeRefreshToken(token) {
    //Decode the token
    var decoded;
    try {
        decoded = jwt.verify(token, TOKEN_SECRET);
    } catch(err) {
        throw {name: 'InvalidTokenError', message: 'Attemped to decode an invalid token.'};
    }

    var userInfo;
    var newAccToken;
    var newRefToken

    //Get user info
    try {
        userInfo = await userInteractions.getUserFromToken(decoded);
    } catch(err) { throw err; }

    //Generate a new access token
    try {
        newAccToken = await generateAccessToken(userInfo.userID);
    } catch(err) { throw err; }

    //Generate a new refresh token
    try {
        newRefToken = await generateRefreshToken(userInfo.userID);
    } catch(err) { throw err; }

    return {user: userInfo, accessToken: newAccToken, refreshToken: newRefToken}
}

//Module exports
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.decodeAccessToken = decodeAccessToken;
exports.decodeRefreshToken = decodeRefreshToken;
