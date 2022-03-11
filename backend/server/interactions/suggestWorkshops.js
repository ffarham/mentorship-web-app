const pool = require('../db');
const notifications = require('./notifications')

async function suggestWorkshops() {
    //Pull the interestTypes from the database
    const interestTypes = await pool.query('SELECT interest FROM interestType');

    for (var i = 0; i < interestTypes.rowCount; i++) {
        //Get the interest
        const interest = interestTypes.rows[i];

        //Count the number of users interested in this interest
        const countUsersResult = await pool.query('SELECT COUNT(*) FROM interest WHERE interest = $1 AND kind = \'mentee\'', [interest]);

        //Guestimate the number of workshops needed to satisfy that number of people (assume approximately 30 interested people needed to run a workshop)
        const workshopCount = Math.floor(countUsersResult.rows[0] / 30);

        //Get the userIDs of enough experts to satisfy that demand
        const expertsResult = await pool.query('SELECT users.userID FROM users INNER JOIN interest ON interest.userID = users.userID WHERE interest.interest = $1 AND interest.kind = \'mentor\' ORDER BY RANDOM() LIMIT $2', [interest, workshopCount]);

        //Notify those experts about the popularity of their area
        for (var j = 0; j < expertsResult.rowCount; j++) {
            notifications.notify(expertsResult.rows[j].userID, `${interest} is popular. Consider running a workshop.`);
        }


    }
}

exports.suggestWorkshops = suggestWorkshops;