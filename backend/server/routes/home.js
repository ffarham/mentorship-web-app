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

//Route to pull all upcoming meetings
router.get("/meetings", checkAuth, async (req, res, next) => {
    //Pull the meetings from the database
    const meetingResult = await pool.query('SELECT * FROM meeting WHERE mentorID = $1 OR menteeID = $1 AND meetingStart + meetingDuration > NOW() ORDER BY meetingStart');

    //Pull the group meetings from the database
    const groupMeetingResult = await pool.query('SELECT groupMeeting.* FROM groupMeeting INNER JOIN groupMeetingAttendee ON groupMeeting.groupMeetingID = groupMeetingAttendee.groupMeetingID WHERE (groupMeetingAttendee.menteeID = $1 OR groupMeeting.mentorID = $1) AND ( groupMeeting.meetingStart + groupMeeting.meetingDuration > NOW() ) ORDER BY meetingStart');

});
