const pool = require('../db');

//Query to create a new notification
const createNewNotificationQuery = 'INSERT INTO notifications VALUES (DEFAULT, $1, $2, NOW(), TRUE)'

/**
 * Nofities a given user with a given message
 * 
 * @param {string} userID The user's ID 
 * @param {string} msg The notification message 
 */
async function notify(userID, msg) {
    //TODO: email user if they want it
    await pool.query(createNewNotificationQuery, [userID, msg]);
}

module.exports = notify;