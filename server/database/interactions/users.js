//Imports:
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const saltRounds = 10; //10 should be enough
const pool = require('../db');


//Query to add user to users table and returns randomly-generated userID
const registerUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, FALSE, $2, $3, $4, $5, $6) RETURNING userID';

//Queries to add mentee/mentor to mentee/mentor table
const registerMenteeQuery = 'INSERT INTO mentee VALUES ($1)';
const registerMentorQuery = 'INSERT INTO mentor VALUES ($1)';

/** 
 * Add a new user to the users table and mentee/mentor table
 * 
 * @param {string} email User's email
 * @param {string} name User's name
 * @param {string} password User's plaintext password
 * @param {string} businessArea User's business area
 * @param {string} userType User's type ('mentee', 'mentor' or 'both')
 * @param {string} profilePicReference Directory to user's profile picture
 * @param {boolean} emailsAllowed True if user gives us permission to send them emails, false otherwise
 * 
 * @throws {EmailAlreadyUsedError} Fails if email is already associated with another account 
 */
async function registerUser(email, name, password, businessArea, userType, profilePicReference, emailsAllowed) {    
    //Generate password hash
    const hash = await bcrypt.hash(password, saltRounds)

    //Execute query that adds user to users table
    var result;
    try {
        result = await pool.query(registerUserQuery, [email, name, hash, businessArea, profilePicReference, emailsAllowed]);
    } catch (err) {
        //Throw appropriate error if email is already used
        if ((err.code === '23505') && (err.constraint === 'users_email_key'))
            throw {name: 'EmailAlreadyUsedError', message: `${email} is already linked to another account!`};

        else
            throw err;
    }
    
    //Extract userID field
    const userID = result.rows[0].userid;

    //Add user to mentee table if neccesary
    if (userType === 'mentee' || userType === 'both') {
        //Execute query
        await pool.query(registerMenteeQuery, [userID]);
    }

    //Add user to mentor table if neccesary 
    if (userType === 'mentor' || userType === 'both') {
        //Execute query
        await pool.query(registerMentorQuery, [userID]);
    }
}


//Query to find a user's password given their email
const findPasswordQuery = 'SELECT password FROM users WHERE email = $1';

/**
 * Checks if email and password match. Returns promise containing true if so, false otherwise
 * 
 * @param {string} email User's email
 * @param {string} password User's password
 * 
 * @throws {UserNotFoundError} Fails if it can't find a user with given email
 */
async function checkEmailAndPassword(email, password) {    
    //Find the password's hash
    const result = await pool.query(findPasswordQuery, [email]);

    if (result.rowCount === 0)
        throw {name: 'UserNotFoundError', message: `Could not find user ${email}!`}

    const hash = result.rows[0].password;

    //Compare hash to input password
    return bcrypt.compare(password, hash);
}

//Query to find a user's information given their email
const findUserFromEmailQuery = 'SELECT * FROM users WHERE email = $1';

/**
 * Returns all user information of user with a given email as an object.
 * 
 * @param {string} email User's email
 * 
 * @throws {UserNotFoundError} Fails if it can't find a user with given email
 */
async function getUserInfoFromEmail(email) {
    const result = await pool.query(findUserFromEmailQuery, [email]);

    if (result.rowCount === 0)
        throw {name: 'UserNotFoundError', message: `Could not find user ${email}!`};

    return result.rows[0];
}

//Query to register an interest for a user
const registerInterestQuery = 'INSERT INTO interest VALUES ($1, $2, $3)';

/**
 * Registers a new interest for a given user
 * 
 * @param {string} userID User's ID
 * @param {string} interest Interest to be registered
 * @param {string} type Either 'mentor', 'mentee' or 'both'
 */
async function registerInterest(userID, interest, type) {
    try {
        //Run query twice to register an interest twice
        if (type === 'both') {
            await pool.query(registerInterestQuery, [userID, interest, 'mentee']);
            await pool.query(registerInterestQuery, [userID, interest, 'mentor']);
        } else {
            await pool.query(registerInterestQuery, [userID, interest, type]);
        }
    } catch (err) {
        //Handle any errors
        if ((err.code === '23505') && (err.constraint === 'interest_userid_fkey')) {
            throw {name: 'UserNotFoundError', message: `Could not find user ${userID}`};
        } else {
            throw err;
        }
    }

}

//Query to register a new auth token
const registerAuthTokenQuery = 'INSERT INTO authToken VALUES ($1, $2, NOW(), $3)';

/**
 * Registers a new auth token for a given user
 * 
 * @param {string} userID User's ID
 * @param {string} timeToLive How long before the token expires
 * @returns The new auth token
 */
async function registerToken(userID, timeToLive) {
    //Generate a securely random token
    const token = crypto.randomUUID();

    //Register the token in the database
    try { 
        await pool.query(registerAuthTokenQuery, [token, userID, timeToLive]);
    } catch (err) {
        //Handle any erros
        if ((err.code === '23505') && (err.constraint === 'authtoken_userid_fkey')) {
            throw {name: 'UserNotFoundError', message: `Could not find user ${userID}`};
        } else {
            throw err;
        }
    }

    //Return the new auth token
    return token;
}

//Module exports:
exports.registerUser = registerUser;
exports.checkEmailAndPassword = checkEmailAndPassword;
exports.getUserInfoFromEmail = getUserInfoFromEmail;
exports.registerInterest = registerInterest;
exports.registerToken = registerToken;

//Informal Testing:
async function main() {
    //await registerUser('bobjim@gmail.com', 'Bob Jimson', 'password', 'area51', 'both', 'pfpic', false);
    registerToken('f74e80fe-148b-40ff-bb8a-c927e33f6c39', '5m');
}

main();