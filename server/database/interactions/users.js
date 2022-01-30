const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const saltRounds = 10; //TODO: Set this to a properly-defined value (though 10 should be enough)
const pool = require('../db');

//Query to add user to users table and returns randomly-generated userID
const registerUserQuery = 'INSERT INTO users VALUES (DEFAULT, $1, FALSE, $2, $3, $4) RETURNING userID';

//Queries to add mentee/mentor to mentee/mentor table
const registerMenteeQuery = 'INSERT INTO mentee VALUES ($1)';
const registerMentorQuery = 'INSERT INTO mentor VALUES ($1, NULL, 0)';

/** 
 * Add a new user to the users table and mentee/mentor table if needed
 * 
 * @param {string} email User's email
 * @param {string} password User's plaintext password
 * @param {string} name User's name
 * @param {string} userType User's type ('mentee', 'mentor' or 'both')
 * @param {string} businessArea User's business area
 */
function registerUser(email, name, password, businessArea, userType) {
    var userID;
    
    //Generate password hash
    bcrypt.hash(password, saltRounds, (err, hash) => {

        //Execute query that adds user to users table
        const params = [email, name, hash, businessArea];
        pool.query(registerUserQuery, params, (err, res) => {
            if (err) {
                //Handle any errors
            } else {
                //Record the userID
                userID = res.rows[0];
            }
        });
    });

    //Add user to mentee table if neccesary
    if (userType === 'mentee' || userType === 'both') {
        pool.query(registerMenteeQuery, [userID], (err, res) => {
            if (err) {
                //Handle any errors
            }
        });
    }

    //Add user to mentor table if neccesary 
    if (userType === 'mentor' || userType === 'both') {
        pool.query(registerMentorQuery, [userID], (err, res) => {
            if (err) {
                //Handle any errors
            }
        });
    }
}

//Query to find a user's password given their email
const findPasswordQuery = 'SELECT password FROM users WHERE email = $1';

/**
 * Checks if email and password match. Returns true if so, false otherwise
 * 
 * @param {string} email 
 * @param {string} password 
 */
function checkEmailAndPassword(email, password) {
    var hash;
    var returnVal;

    pool.query(findPasswordQuery, [email], (err, res) => {
        if (err) {
            //Handle any errors
        } else {
            //Record password hash
            hash = res.rows[0];
        }
    });

    //Compare hash to input password
    bcrypt.compare(password, hash, (err, res) => { 
        returnVal = res;
    });

    return returnVal;
}

exports.registerUser = registerUser;