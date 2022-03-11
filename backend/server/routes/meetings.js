const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');
const notifications = require('../interactions/notifications')

const getGroupMeetingFeedback = 
`select * from 
    (select groupMeetingID, feedback from groupMeetingFeedback 
        where groupMeetingID = $1) A 
    JOIN 
    (select groupMeetingID from groupMeeting 
        where mentorID = $2) B 
    ON A.groupMeetingID = B.groupMeetingID`;

router.post('/createMeeting', checkAuth, async (req, res, next) => {
    try {
        //Add the new meeting to the database
        await pool.query('INSERT INTO meeting VALUES (DEFAULT, $1, $2, $3, NOW(), $4, $5, $6, NULL, FALSE, $7, NULL, NULL, $8)', [req.body.meetingName, req.body.mentorID, req.userInfo.userID, req.body.meetingStart, req.body.meetingDuration, req.body.place, req.body.requestMessage, req.body.description]);
        
        res.send('Success!');
    } catch (err) {
        console.log(err);
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
        console.log(err);
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

        //Notify the user
        notifications.notify(result.rows[0].mentorid, `A new time has been confirmed for ${result.rows[0].meetingname}.`);
        
        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});


router.post('/cancelMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {
    try {
        var affectedUsers = [];
        var meetingName;

        if (req.userInfo.userType === 'mentee' && req.params.meetingType === 'meeting') {
            //Delete the meeting
            const result = await pool.query('DELETE FROM meeting WHERE meetingID = $1 AND menteeID = $2 RETURNING mentorID, meetingName', [req.params.meetingID, req.userInfo.userID]);

            //Record affected user info and meeting name
            affectedUsers.push(result.rows[0].mentorid);
            meetingName = result.rows[0].meetingname;

        } else if (req.userInfo.userType === 'mentor') {
            //Delete the records in groupMeetingAttendees
            const affectedUsersResult = await pool.query('DELETE FROM groupMeetingAttendees USING groupMeeting WHERE groupMeeting.groupMeetingID = groupMeetingAttendees.groupMeetingID AND groupMeetingAttendees.groupMeetingID = $1 AND groupMeeting.mentorID = $2 RETURNING menteeID', [req.params.meetingID, req.userInfo.userID]);

            //Pull affected users
            for (var i = 0; i < affectedUsersResult.rowCount; i++) {
                affectedUsers.push(affectedUsersResult.rows[i].menteeid);
            }

            //Delete the record in groupMeeting
            const meetingNameResult = await pool.query('DELETE FROM groupMeeting WHERE groupMeetingID = $1 AND menteeID = $2', [req.params.meetingID, req.userInfo.userID]);

            //Pull the name of the meeting
            meetingName = meetingNameResult.rows[0].meetingname;
        }

        //Push notifications
        for (var i = 0; i < affectedUsers.length; i++) {
            notifications.notify(affectedUsers[i], `${meetingName} has been cancelled.`);
        }

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});

router.post('/acceptMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {
    try {
        if (req.userInfo.userType === 'mentor' && req.params.meetingType === 'meeting') {
            //Update the meeting table
            const menteeResult = await pool.query('UPDATE meeting SET confirmed = \'true\' WHERE meetingID = $1 AND mentorID = $1 RETURNING menteeID', [req.params.meetingID, req.userInfo.userID]);

            //Notify the mentee
            notifications.notify(menteeResult.rows[0].menteeid, `${req.userInfo.name} has accepted your meeting request.`);
        } else if (req.userInfo.userType === 'mentee' && (req.params.meetingType === 'group-meeting' || req.params.meetingType === 'workshop')) {
            //Update the groupMeetingAttendees table
            await pool.query('UPDATE groupMeetingAttendees SET confirmed = TRUE WHERE groupMeetingID = $1 AND menteeID = $1', [req.params.meetingID, req.userInfo.userID]);
        }

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
    }

    next();
});

router.post('/rejectMeeting/:groupMeetingID', checkAuth, async (req, res, next) => {
    try {
        //Update the groupMeetingAttendees table accordingly
        await pool.query('UPDATE groupMeetingAttendees SET confirmed = FALSE WHERE groupMeetingID = $1 AND menteeID = $1', [req.params.meetingID, req.userInfo.userID]);

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
        next();
    }

    next();
});
// Give feedback on individual meetings
router.post('/feedback/meeting/:meetingID', checkAuth, async (req, res, next) => {
    try {
        let feedback = req.body.feedback;
        if (req.userInfo.userType === 'mentor') {
            await pool.query("UPDATE meeting SET mentorFeedback = $1 WHERE meetingID = $2", [feedback, req.params.meetingID]);
        } else{
            await pool.query("UPDATE meeting SET menteeFeedback = $1 WHERE meetingID = $2", [feedback, req.params.meetingID]);
        }
        res.send('success');
        next();
    } catch (err) {
        res.status(500).json(err);
        next();
    }
});

router.post('/feedback/groupmeeting/:meetingID' , checkAuth, async (req, res, next) => {
    try{
        let feedback = req.body.feedback;
        await pool.query("INSERT INTO groupMeetingFeedback VALUES(DEFAULT, $1, $2)", [req.params.meetingID, feedback]); 
        res.send("success");
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }
});

router.post('/feedback/view/meeting/:meetingID',  checkAuth, async (req, res, next) => {
    try{
        let results = null;
        let feedbackString = null;
        if(req.userInfo.userType === 'mentor'){
            results = await pool.query("SELECT * from meeting WHERE meetingID = $1 AND mentorID = $2", [req.params.meetingID, req.userInfo.userID]);
            feedbackString = result.rows[0].menteeFeedback; 
        } else{
            results = await pool.query("SELECT * from meeting WHERE meetingID = $1 AND menteeID = $2", [req.params.meetingID, req.userInfo.userID]);
            feedbackString = result.rows[0].mentorFeedback;
        }
        let f = {
            feedback: feedbackString,
        }
        res.json(f);
        next();
    }catch(err){
        res.status(500).json(err);
        next();
    }    
});

router.post('/feedback/view/groupmeeting/:meetingID', checkAuth, async (req, res, next) =>{
    try {
        const results = await pool.query(getGroupMeetingFeedback, [req.params.meetingID, req.userInfo.userID]);
        let feedbackMessages = [];
        for(let i = 0; i < results.rowCount; ++i){
            let menteeFeedback = {
                feedback: results.rows[i].feedback
            };
            menteeFeedback.push(feedbackMessages);
        }
        res.json(menteeFeedback);
        next();
    } catch(err){
        res.status(500).json(err);
        next();
    }
});


module.exports = router;