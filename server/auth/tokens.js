const jwt = require('jsonwebtoken');
const userInteractions = require('../database/interactions/users');

//Secret key for signing tokens
const TOKEN_SECRET = '4a6c48ca3d2730d1c77c2ff9fc89ebbd15b1943a13736f552921421820c9059fe2faea884c20aa510b08f85e5f140d014593b552ba4a1cc71fb4ae8fcb70d17f';

//Time to live for refresh tokens
const refreshTTL = '4800h';

//Time to live for access tokens
const accessTTL = '5m';

/**
 * Generate a new access token for a given user
 * 
 * @param {string} userID userID of user to generate an access token for
 * @param {string} loggedInAs Either mentee or mentor 
 * 
 * @returns {object} The access token in JWT format
 */
async function generateAccessToken(userID, loggedInAs) {
    try {
        //Record new token in the database
        const token = await userInteractions.registerToken(userID, accessTTL, 'acc', loggedInAs);

        //Generate a new token that expires at the correct time
        return jwt.sign({data: token}, TOKEN_SECRET, {expiresIn: accessTTL});
    } catch (err) { throw err; }
}

/**
 * Generate a new refresh token for a given user
 * 
 * @param {string} userID userID of user to generate a refresh token for
 * @returns {object} The refresh token in JWT format 
 */
async function generateRefreshToken(userID, loggedInAs) {
    try {
        //Record new token in the database
        const token = await userInteractions.registerToken(userID, refreshTTL, 'ref', loggedInAs);
        
        //Generate a new token that expires at the correct time
        return jwt.sign({data: token}, TOKEN_SECRET, {expiresIn: refreshTTL});
    } catch (err) { throw err; }
}

/**
 * 
 * @param {*} token 
 * @returns 
 */
async function decodeAccessToken(token) {
    //Decode the token
    var decoded;
    try {
        decoded = jwt.verify(token, TOKEN_SECRET).data;
        console.log(decoded);
    } catch(err) {
        //Throw an error if the token is invalid
        throw {name: 'InvalidTokenError', message: 'Attemped to decode an invalid token.'};
    }
    
    //Get user info
    var userInfo;
    try {
        userInfo = await userInteractions.getUserFromAccessToken(decoded);
    } catch(err) { throw err; }

    return userInfo;
}

async function decodeRefreshToken(token) {
    //Decode the token
    var decoded;
    try {
        decoded = jwt.verify(token, TOKEN_SECRET).data;
    } catch(err) {
        console.log(err);
        throw {name: 'InvalidTokenError', message: 'Attemped to decode an invalid token.'};
    }

    var user;
    var newAccToken;
    var newRefToken;

    //Get user info
    try {
        user = await userInteractions.getUserFromRefreshToken(decoded);
    } catch(err) { throw err; }

    //Generate a new access token
    try {
        newAccToken = await generateAccessToken(user.userID, user.loggedInAs);
    } catch(err) { throw err; }

    //Generate a new refresh token
    try {
        newRefToken = await generateRefreshToken(user.userID, user.loggedInAs);
    } catch(err) { throw err; }

    return {accessToken: newAccToken, refreshToken: newRefToken};
}

//Module exports
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.decodeAccessToken = decodeAccessToken;
exports.decodeRefreshToken = decodeRefreshToken;


//Informal testing:
async function main() {
    var token = await generateRefreshToken('59f91506-0b06-4d35-8616-2f57dfde3ad2', 'mentee');
    
    /*
    var newTokens = await decodeRefreshToken(token);
    var newAccToken = newTokens.accessToken;
    var refreshToken = newTokens.refreshToken;

    console.log(newTokens);
    */

    console.log(token);
}

//main();