const pool = require('../db');

const createNewNotificationQuery = 'INSERT INTO notifications VALUES (DEFAULT, $1, $2, NOW(), NULL)'

async function notify(userID, msg) {
    await pool.query(createNewNotificationQuery, [userID, msg]);
}

exports.notify = notify