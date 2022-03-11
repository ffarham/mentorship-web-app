const pool = require('../db');

//Query to create a new notification
const createNewNotificationQuery = 'INSERT INTO notifications VALUES (DEFAULT, $1, $2, NOW(), $3, FALSE)'

/**
 * Nofities a given user with a given message
 * 
 * @param {string} userID The user's ID 
 * @param {string} msg The notification message 
 */
async function notify(userID, msg, type) {
    //TODO: email user if they want it
    await pool.query(createNewNotificationQuery, [userID, msg, type]);
}

exports.notify = notify;