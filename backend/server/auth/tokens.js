const jwt = require('jsonwebtoken');
const userInteractions = require('../interactions/users');

//Secret key for signing tokens
const TOKEN_SECRET = '4a6c48ca3d2730d1c77c2ff9fc89ebbd15b1943a13736f552921421820c9059fe2faea884c20aa510b08f85e5f140d014593b552ba4a1cc71fb4ae8fcb70d17f';

//Time to live for refresh tokens
const refreshTTL = '672h';

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
 * Decode a given access token and return the associated user info
 * 
 * @param {string} token The access token to decode
 * @returns User information
 */
async function decodeAccessToken(token) {
    //Decode the token
    var decoded;
    try {
        decoded = jwt.verify(token, TOKEN_SECRET).data;
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

/**
 * Decode a given refresh token and return new access and refresh tokens
 * 
 * @param {string} token The refresh token to decode
 * @returns New access and refresh tokens
 */
async function decodeRefreshToken(token) {
    //Decode the token
    var decoded;
    try {
        console.log(token);
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
        newAccToken = await generateAccessToken(user.userID, user.userType);
    } catch(err) { throw err; }

    //Generate a new refresh token
    try {
        newRefToken = await generateRefreshToken(user.userID, user.userType);
    } catch(err) { throw err; }

    return {newAccessToken: newAccToken, newRefreshToken: newRefToken};
}

//Module exports
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.decodeAccessToken = decodeAccessToken;
exports.decodeRefreshToken = decodeRefreshToken;