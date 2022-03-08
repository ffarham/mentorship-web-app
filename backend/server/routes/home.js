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
                timeCreated : notification.timecreated
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

/* Mentee query:
  (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingDuration, meeting.place, meeting.confirmed, meeting.attended, meeting.feedback 
    FROM meeting 
    INNER JOIN users ON meeting.mentorID = users.userID 
    WHERE meeting.menteeID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW())

  UNION

  (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, users.name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.place, groupMeeting.meetingStart, groupMeeting.meetingDuration, (SELECT COUNT(*) FROM groupMeetingAttendee INNER JOIN groupMeeting on groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID WHERE groupMeetingAttendee.confirmed = TRUE) AS confirmed FROM groupMeeting 
    INNER JOIN users ON groupMeeting.mentorID = users.userID 
    WHERE groupMeetingAttendee.menteeID = $1 AND (groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW()))

  ORDER BY meetingStart 

  Mentor query:
    (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingDuration, meeting.place, meeting.confirmed, meeting.attended, meeting.feedback FROM meeting INNER JOIN users ON meeting.menteeID = users.userID WHERE meeting.mentorID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW()) UNION (SELECT groupMeetingID AS meetingID, kind AS meetingType, name, groupMeetingName AS meetingName, place, meetingStart, meetingDuration, (SELECT COUNT(*) FROM groupMeetingAttendee INNER JOIN groupMeeting on groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID WHERE groupMeetingAttendee.confirmed = TRUE) AS confirmed FROM groupMeeting WHERE mentorID = $1 AND (meetingStart + meetingDuration > NOW())) ORDER BY meetingStart

*/

//Route to pull all upcoming meetings
router.get("/meetings", checkAuth, async (req, res, next) => {
    //Choose the correct database query
    var query;
    if (req.userInfo.userType === 'mentee') {
        query = "(SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingDuration, meeting.place, meeting.confirmed, meeting.attended, meeting.description, meeting.feedback FROM meeting INNER JOIN users ON meeting.mentorID = users.userID WHERE meeting.menteeID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW()) UNION (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, users.name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.place, groupMeeting.meetingStart, groupMeeting.meetingDuration, groupMeeting.description, (SELECT COUNT(*) FROM groupMeetingAttendee INNER JOIN groupMeeting on groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID WHERE groupMeetingAttendee.confirmed = TRUE) AS confirmed FROM groupMeeting INNER JOIN users ON groupMeeting.mentorID = users.userID WHERE groupMeetingAttendee.menteeID = $1 AND (groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW())) ORDER BY meetingStart DESC";
    } else if (req.userInfo.userType === 'mentor') {
        query = "(SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingDuration, meeting.place, meeting.confirmed, meeting.attended, meeting.description, meeting.feedback FROM meeting INNER JOIN users ON meeting.menteeID = users.userID WHERE meeting.mentorID = $1 AND meeting.meetingStart + meeting.meetingDuration > NOW()) UNION (SELECT groupMeetingID AS meetingID, kind AS meetingType, name, groupMeetingName AS meetingName, place, meetingStart, meetingDuration, description, (SELECT COUNT(*) FROM groupMeetingAttendee INNER JOIN groupMeeting on groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID WHERE groupMeetingAttendee.confirmed = TRUE) AS confirmed, groupMeeting.attended FROM groupMeeting WHERE mentorID = $1 AND (meetingStart + meetingDuration > NOW())) ORDER BY meetingStart DESC";
    }

    //Run the database query
    const result = await pool.query(query, [req.userInfo.userID]);

    //Format the results
    var meetingResult;
    for (var i = 0; i < result.rowCount; i++) {
        meetingResult = result.rows[i];

        meeting = {
            meetingID : meetingResult.meetingID,
            meetingType : meetingResult.meetingType,
            meetingName : meetingResult.meetingName,
            mentorName : '',
            menteeName : '',
            meetingStart : meetingResult.meetingStart,
            meetingDuration : meetingResult.meetingDuration,
            place : meetingResult.place,
            confirmed : meetingResult.confirmed,
            attended : meetingResult.attended,
            description : meetingResult.description
        }

        if (req.userInfo.userType === 'mentee') {

        } else if (req.userInfo.userType === 'mentor') {
            
        }
    }
});
