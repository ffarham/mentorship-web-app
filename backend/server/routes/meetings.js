const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');
const notifications = require('../interactions/notifications')

router.post('/createMeeting', checkAuth, async (req, res, next) => {
    try {
        //Add the new meeting to the database
        await pool.query('INSERT INTO meeting VALUES (DEFAULT, $1, $2, $3, NOW(), $4, $5, $6, NULL, FALSE, $7, NULL, NULL, $8)', [req.body.mentorID, req.userInfo.userID, req.body.meetingStart, req.body.meetingDuration, req.body.place, req.body.requestMessage, req.body.description]);
        
        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});

router.post('/createGroupMeeting', checkAuth, async (req, res, next) => {
    try {
        //Add the new meeting to the database
        const makeMeetingResult = await pool.query('INSERT INTO groupMeeting VALUES (DEFAULT, $1, $2, NOW(), $3, $4, $5, $6, FALSE, $7) RETURNING groupMeetingID', [req.body.meetingName, req.userInfo.userID, req.body.meetingStart, req.body.meetingDuration, req.body.kind, req.body.place, req.body.description]);

        //Get the ID of the new meeting
        const groupMeetingID = makeMeetingResult.rows[0].groupmeetingid;

        //Inform appropriate users

        var interestedUsersResult;
        var notificationMessage;
        if (req.body.kind === 'group-meeting') {
            //Pull the user IDs of users the mentor is mentoring
            interestedUsersResult = await pool.query('SELECT users.userID FROM users INNER JOIN mentoring ON users.userID = mentoring.menteeID WHERE mentoring.mentorID = $1', [req.userInfo.userID]);

            //Pick a notification message
            notificationMessage = `${req.userInfo.name} is running a group meeting.`
        } else if (req.body.kind === 'workshop') {
            //Pull the IDs of users interested in what the workshop is about
            interestedUsersResult = await pool.query('SELECT users.userID FROM users INNER JOIN interest ON users.userID = interest.userID WHERE interest.interest = $1', [req.body.specialty]);

            //Pick a notification message
            notificationMessage = `${req.userInfo.name} is running a workshop about ${req.body.specialty}.`
        }

        //Notify each user and add record them as an attendee
        var attendeeID;
        for (var i = 0; i < interestedUsersResult.rowCount; i++) {
            attendeeID = interestedUsersResult.rows[i].userid;

            //Notify the user
            notifications.notify(attendeeID, notificationMessage);
            
            //Add the user to the groupMeetingAttendees table
            await pool.query('INSERT INTO groupMeetingAttendees VALUES ($1, $2, FALSE, NULL)', [groupMeetingID, attendeeID]);
        }

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});

router.post('/rescheduleMeeting/:meetingID', checkAuth, async (req, res, next) => {
    try {
        //Update the meeting table and pull the menteeID
        const result = await pool.query('UPDATE meeting SET confirmed = \'reschedule\' WHERE meetingID = $1 AND mentorID = $2 RETURNING menteeID', [req.params.meetingID, req.userInfo.userID]);

        const menteeID = result.rows[0].menteeid;

        //Notify the mentee of the rescheduling
        notifications.notify(menteeID, req.body.rescheduleMessage);

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});

router.post('/meetingUpdate/:meetingID', checkAuth, async (req, res, next) => {
    try {
        //Update the meeting table with the new times and pull the mentorID
        const result = await pool.query('UPDATE meeting SET confirmed = \'reschedule\', meetingStart = $1, meetingDuration = $2 WHERE meetingID = $3 AND menteeID = $4 RETURNING mentorID, meetingName', [req.body.meetingStart, req.body.meetingDuration, req.params.meetingID, req.userInfo.userID]);

        notifications.notify(result.rows[0].mentorid, `A time has been confirmed for ${result.rows[0].meetingname}.`);
        
        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});


router.post('/cancelMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {

});

router.post('/acceptMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {

});

router.post('/rejectMeeting/:groupMeetingID', checkAuth, async (req, res, next) => {
    
});

module.exports = router;