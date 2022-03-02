const router = require("express").Router();


router.get("/mentor/:mentorid", (req, res) => {
    //mentor's homepage    
});

//Query to pull current meetings from the database
const getCurrentMeetingsQuery = "SELECT * FROM meeting mentorID = $1 AND meetingStart + meetingDuration > NOW() ORDER BY meetingStart DESC"

//Query to pull current group meetings from the database
const getCurrentGroupMeetingsQuery = "SELECT * FROM groupMeeting WHERE mentorID = $1 AND meetingStart + meetingDuration > NOW() ORDER BY meetingStart DESC"

//Query to pull group meeting attendees from the database
const getGroupMeetingAttendeesQuery = "SELECT groupMeetingAttendee.*, users.userID, users.email, users.name FROM groupMeetingAttendee INNER JOIN users ON groupMeetingAttendee.menteeID = users.userID WHERE groupMeetingAttendee.groupMeetingID = $1"

// The mentor's current schedule
router.get("/mentor/:mentorid/schedule", (req, res) => {
     
});

// The mentor's notifications
router.get("/mentor/:mentorid/notifs", (req, res) => {

});
