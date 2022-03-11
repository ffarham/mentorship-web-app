const router = require("express").Router();
const userInteractions = require('../interactions/users');
const notifications = require('../interactions/notifications');
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

//Route to pull notifications from the database
router.get("/notifications", checkAuth, async (req, res, next) => {
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
        next();
    } catch(err) {
        res.status(500).json(err);
    }
});

//Route to dismiss a notification
router.post("/dismissnotification/:notificationID", checkAuth, async (req, res, next) => {
    //Dismiss the notification
    await pool.query('UPDATE notifications SET dismissed = TRUE WHERE notificationID = $1', [req.params.notificationID]);

    res.send('Success!');
});


//Route to pull all upcoming meetings
router.get("/meetings", checkAuth, async (req, res, next) => {
    try {
        //Choose the correct database query
        var query;
        if (req.userInfo.userType === 'mentee') {
            query = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingDuration, meeting.place, meeting.confirmed, meeting.attended::INTEGER, meeting.description, meeting.mentorFeedback AS feedback, meeting.requestMessage
                FROM meeting 
                INNER JOIN users ON meeting.mentorID = users.userID 
                WHERE meeting.menteeID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW())
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, users.name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingDuration, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS confirmed, groupMeeting.description, '' AS feedback, '' AS requestMessage
                FROM groupMeeting 
                INNER JOIN users ON groupMeeting.mentorID = users.userID
                INNER JOIN groupMeetingAttendee ON groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID 
                WHERE groupMeetingAttendee.menteeID = $1 AND groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW()) 
                
            ORDER BY meetingStart
            `;
        } else if (req.userInfo.userType === 'mentor') {
            query = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingDuration, meeting.place, meeting.confirmed, meeting.attended::INTEGER, meeting.description, meeting.menteeFeedback AS feedback, meeting.requestMessage
                FROM meeting 
                INNER JOIN users ON meeting.menteeID = users.userID 
                WHERE meeting.mentorID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW())
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, 'Several' AS name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingDuration, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS confirmed, groupMeeting.description, '' AS feedback, '' AS requestMessage
                FROM groupMeeting 
                WHERE groupMeeting.mentorID = $1 AND groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW()) 
                
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

            meeting = {
                meetingID : meetingResult.meetingid,
                meetingType : meetingResult.meetingtype,
                meetingName : meetingResult.meetingname,
                mentorName : req.userInfo.userType === 'mentor' ? req.userInfo.name : meetingResult.name,
                menteeName : req.userInfo.userType === 'mentee' ? req.userInfo.name : meetingResult.name,
                meetingStart : meetingResult.meetingstart,
                meetingDuration : meetingResult.meetingduration,
                place : meetingResult.place,
                confirmed : meetingResult.confirmed,
                complete : meetingResult.attended,
                description : meetingResult.description
            }

            responseObject.push(meetingResult);
        }

        //Send the response
        res.json(responseObject);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
