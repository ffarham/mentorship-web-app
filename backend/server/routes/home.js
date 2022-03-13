const router = require("express").Router();
const userInteractions = require('../interactions/users');
const notifications = require('../interactions/notifications');
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

//Route to pull notifications from the database
router.get("/notifications", checkAuth, async (req, res, next) => {
    console.log("/notifications\n" + req.body)
    try {
        //Pull out all notifications objects for the user in the correct order
        const result = await pool.query('SELECT * FROM notifications WHERE userID = $1 AND dismissed = FALSE ORDER BY timeCreated DESC', [req.userInfo.userID]);

        //Format all the notifications nicely
        var responseObject = [];
        var notification;
        for (var i = 0; i < result.rowCount; i++) {
            notification = result.rows[i]; 

            responseObject.push({
                notificationID : notification.notificationid,
                userID : notification.userid,
                msg : notification.msg,
                timeCreated : notification.timecreated,
                type : notification.kind
            });
        }

        res.json(responseObject);
    } catch(err) {
        res.status(500).json(err);
        console.log(err);
    }

    next();
});

//Route to dismiss a notification
router.post("/dismissnotification/:notificationID", checkAuth, async (req, res, next) => {
    console.log("dismissnotification/" + req.params.notificationID + "\n" + req.body)

    try {
        //Dismiss the notification
        await pool.query('UPDATE notifications SET dismissed = TRUE WHERE notificationID = $1 AND userID = $2', [req.params.notificationID, req.userInfo.userID]);

        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});


//Route to pull all upcoming meetings
router.get("/meetings", checkAuth, async (req, res, next) => {
    console.log("\n/meetings\n" + req.body)
    try {
        //Choose the correct database query
        var query;
        if (req.userInfo.userType === 'mentee') {
            query = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR as durationString, meeting.place, meeting.confirmed, meeting.attended::INTEGER, meeting.description, meeting.mentorFeedback AS feedback, meeting.requestMessage, meeting.status
                FROM meeting 
                INNER JOIN users ON meeting.mentorID = users.userID 
                WHERE meeting.menteeID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW()AND meeting.confirmed != \'false\' AND meeting.status = 'ongoing')
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, users.name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS confirmed, groupMeeting.description, '' AS feedback, '' AS requestMessage, groupMeeting.status
                FROM groupMeeting 
                INNER JOIN users ON groupMeeting.mentorID = users.userID
                INNER JOIN groupMeetingAttendee ON groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID 
                WHERE groupMeetingAttendee.menteeID = $1 AND groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW() AND groupMeeting.status = 'ongoing') 
                
            ORDER BY meetingStart
            `;
        } else if (req.userInfo.userType === 'mentor') {
            query = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR AS durationString, meeting.place, meeting.confirmed, meeting.attended::INTEGER, meeting.description, meeting.status, meeting.menteeFeedback AS feedback, meeting.requestMessage
                FROM meeting 
                INNER JOIN users ON meeting.menteeID = users.userID 
                WHERE meeting.mentorID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW() AND meeting.confirmed != \'false\' AND meeting.status = 'ongoing')
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, 'Several' AS name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS confirmed, groupMeeting.description, groupMeeting.status, '' AS feedback, '' AS requestMessage
                FROM groupMeeting 
                WHERE groupMeeting.mentorID = $1 AND groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW() AND groupMeeting.status = 'ongoing') 
                
            ORDER BY meetingStart
            `;
        }

        //Run the database query
        const result = await pool.query(query, [req.userInfo.userID]);

        //Format the results
        var responseObject = [];
        var meetingResult;
        for (var i = 0; i < result.rowCount; i++) {
            meetingResult = result.rows[i];

            let meeting = {
                meetingID : meetingResult.meetingid,
                meetingType : meetingResult.meetingtype,
                meetingName : meetingResult.meetingname,
                mentorName : req.userInfo.userType === 'mentor' ? req.userInfo.name : meetingResult.name,
                menteeName : req.userInfo.userType === 'mentee' ? req.userInfo.name : meetingResult.name,
                meetingStart : meetingResult.startString,
                meetingDuration : meetingResult.durationString,
                place : meetingResult.place,
                confirmed : meetingResult.confirmed,
                status: meetingResult.status,
                complete : meetingResult.attended,
                meetingDescription : meetingResult.description
            }

            responseObject.push(meeting);
        }

        //Send the response
        res.json(responseObject);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
