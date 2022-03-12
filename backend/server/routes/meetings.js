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
        console.log("/createmeeting \n" + req.body);

        console.log([req.body.meetingName, req.body.mentorID, req.userInfo.userID, req.body.meetingStart, req.body.meetingDuration, req.body.place, req.body.requestMessage, req.body.meetingDescription]);

        //Add the new meeting to the database
        await pool.query('INSERT INTO meeting VALUES (DEFAULT, $1, $2, $3, NOW(), $4, $5, $6, \'false\', FALSE, $7, NULL, NULL, $8)', [req.body.meetingName, req.body.mentorID, req.userInfo.userID, req.body.meetingStart, req.body.meetingDuration, req.body.place, req.body.requestMessage, req.body.meetingDescription]);

        //Notify the mentor
        notifications.notify(req.body.mentorID, `${req.userInfo.name} would like to create a meeting`, 'Meeting Request');
        
        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});

router.post('/createGroupMeeting', checkAuth, async (req, res, next) => {
    try {

        console.log("/createGroupMeeting\n" + req.body);

        var meetingName = req.body.meetingName;

        //Add the new meeting to the database
        const makeMeetingResult = await pool.query('INSERT INTO groupMeeting VALUES (DEFAULT, $1, $2, NOW(), $3, $4, $5, $6, FALSE, $7) RETURNING groupMeetingID', [meetingName, req.userInfo.userID, req.body.meetingStart, req.body.meetingDuration, req.body.meetingType, req.body.place, req.body.description]);

        //Get the ID of the new meeting
        const groupMeetingID = makeMeetingResult.rows[0].groupmeetingid;

        //Inform appropriate users
        var interestedUsersResult;
        var notificationMessage;
        if (req.body.meetingType === 'group-meeting') {
            //Pull the user IDs of users the mentor is mentoring
            interestedUsersResult = await pool.query('SELECT users.userID FROM users INNER JOIN mentoring ON users.userID = mentoring.menteeID WHERE mentoring.mentorID = $1', [req.userInfo.userID]);

            //Pick a notification message
            notificationMessage = `${req.userInfo.name} is running a group meeting.`
        } else if (req.body.meetingType === 'workshop') {
            //Pull the IDs of users interested in what the workshop is about
            interestedUsersResult = await pool.query('SELECT users.userID FROM users INNER JOIN interest ON users.userID = interest.userID WHERE interest.interest = $1', [req.body.topic]);

            //Pick a notification message
            notificationMessage = `${req.userInfo.name} is running a workshop about ${req.body.topic}.`
        }

        //Notify each user and add record them as an attendee
        var attendeeID;
        for (var i = 0; i < interestedUsersResult.rowCount; i++) {
            attendeeID = interestedUsersResult.rows[i].userid;

            //Notify the user
            notifications.notify(attendeeID, notificationMessage, req.body.meetingType === 'group-meeting' ? 'Group Meeting Created' : 'Workshop Created');
            
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

//
router.get('/getMeetingRequests', checkAuth, async (req, res, next) => {
    try {
        console.log("/getMeetingRequests\n" + req.body);
        //Pull the meeting info from the database
        var query;
        if (req.userInfo.userType === 'mentee') {
            query = `
            SELECT groupMeeting.*, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, users.name FROM groupMeetingAttendee 
                INNER JOIN groupMeeting ON groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID 
                INNER JOIN users ON users.userID = groupMeeting.mentorID
                WHERE groupMeetingAttendee.menteeID = $1 AND confirmed IS NULL
            `;
        } else if (req.userInfo.userType === 'mentor') {
            query = `
            SELECT meeting.*, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR AS durationString, users.name FROM meeting 
                INNER JOIN users ON meeting.menteeID = users.userID WHERE meeting.mentorID = $1 AND meeting.confirmed != \'true\'
            `;
        }

        const result = await pool.query(query, [req.userInfo.userID]);

        //Format the response nicely
        var responseObject = [];
        var meetingResult;
        for (var i = 0; i < result.rowCount; i++) {
            meetingResult = result.rows[i];

            if (req.userInfo.userType === 'mentee') {
                responseObject.push({
                    meetingID : meetingResult.groupmeetingid,
                    meetingName : meetingResult.kind === 'workshop' ? meetingResult.groupmeetingname : meetingResult.name,
                    meetingDescription : meetingResult.description,
                    otherName : meetingResult.name,
                    meetingStart : meetingResult.startstring,
                    meetingDuration : meetingResult.durationstring,
                    place : meetingResult.place,
                    meetingType : meetingResult.kind
                });
            } else if (req.userInfo.userType === 'mentor') {
                responseObject.push({
                    meetingID : meetingResult.meetingid,
                    meetingName : meetingResult.meetingname,
                    meetingDescription : meetingResult.description,
                    otherName : meetingResult.name,
                    meetingStart : meetingResult.startstring,
                    meetingDuration : meetingResult.durationstring,
                    place : meetingResult.place,
                    meetingType : 'meeting'
                });
            }
        }

        //Send response
        res.json(responseObject);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

});

router.post('/rescheduleMeeting/:meetingID', checkAuth, async (req, res, next) => {
    try {
        console.log("/rescheduleMeeting\n" + req.body);
        //Update the meeting table and pull the menteeID
        const result = await pool.query('UPDATE meeting SET confirmed = \'reschedule\' WHERE meetingID = $1 AND mentorID = $2 RETURNING menteeID', [req.params.meetingID, req.userInfo.userID]);

        const menteeID = result.rows[0].menteeid;

        //Notify the mentee of the rescheduling
        notifications.notify(menteeID, req.body.rescheduleMessage, 'Meeting Rescheduled');

        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});

router.post('/meetingUpdate/:meetingID', checkAuth, async (req, res, next) => {
    try {
        console.log("/meetingUpdate\n" + req.body);
        //Update the meeting table with the new times and pull the mentorID
        const result = await pool.query('UPDATE meeting SET confirmed = \'reschedule\', meetingStart = $1 WHERE meetingID = $3 AND menteeID = $4 RETURNING mentorID, meetingName', [req.body.meetingStart, req.params.meetingID, req.userInfo.userID]);

        //Notify the user
        notifications.notify(result.rows[0].mentorid, `A new time has been set for ${result.rows[0].meetingname}.`, 'Meeting Rescheduled');
        
        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});


router.post('/cancelMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {
    try {
        console.log("/cancelMeeting/" + req.params.meetingID + "/" + req.params.meetingType + "\n" + req.body);
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
            notifications.notify(affectedUsers[i], `${meetingName} has been cancelled.`, 'Meeting Cancelled');
        }

        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});

router.post('/acceptMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {
    try {
        console.log("/acceptMeeting/" + req.params.meetingID + "/" + req.params.meetingType + "\n" + req.body);
        if (req.userInfo.userType === 'mentor' && req.params.meetingType === 'meeting') {
            //Update the meeting table
            const menteeResult = await pool.query('UPDATE meeting SET confirmed = \'true\' WHERE meetingID = $1 AND mentorID = $1 RETURNING menteeID', [req.params.meetingID, req.userInfo.userID]);

            //Notify the mentee
            notifications.notify(menteeResult.rows[0].menteeid, `${req.userInfo.name} has accepted your meeting request.`, 'Meeting Accepted');
        } else if (req.userInfo.userType === 'mentee' && (req.params.meetingType === 'group-meeting' || req.params.meetingType === 'workshop')) {
            //Update the groupMeetingAttendees table
            await pool.query('UPDATE groupMeetingAttendees SET confirmed = TRUE WHERE groupMeetingID = $1 AND menteeID = $1', [req.params.meetingID, req.userInfo.userID]);
        }

        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});

router.post('/rejectMeeting/:meetingID', checkAuth, async (req, res, next) => {
    try {
        console.log("/rejectMeeting/" + req.params.meetingID + "\n" + req.body);
        //Update the groupMeetingAttendees table accordingly
        await pool.query('UPDATE groupMeetingAttendees SET confirmed = FALSE WHERE groupMeetingID = $1 AND menteeID = $2', [req.params.meetingID, req.userInfo.userID]);

        res.send('Success!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

    next();
});

router.post('/markMeetingComplete/:meetingID/:meetingType', checkAuth, async (req, res, next) => {
    console.log('/markMeetingComplete\n' + req.params.meetingID + '/' + req.params.meetingType + '\n');
    try {
        if (req.params.meetingType === 'meeting') {
            await pool.query('UPDATE meeting SET attended = TRUE WHERE mentorID = $1 AND meetingID = $2', [req.userInfo.userID, req.params.meetingID]);
        } else {
            await pool.query('UPDATE groupMeeting SET attended = TRUE WHERE mentorID = $1 AND groupMeetingID = $2', [req.userInfo.userID, req.params.meetingID]);
        }

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

    next();
});

// Give feedback on a one-to=one meeting
router.post('/feedback/meeting/:meetingID', checkAuth, async (req, res, next) => {
    try {
        console.log("/feeback/meeting/" + req.params.meetingID + "\n" + req.body);
        let feedback = req.body.feedback;
        var result;
        if (req.userInfo.userType === 'mentor') {
            result = await pool.query("UPDATE meeting SET mentorFeedback = $1 WHERE meetingID = $2 RETURNING mentorID AS userID, meetingName", [feedback, req.params.meetingID]);
        } else{
            result = await pool.query("UPDATE meeting SET menteeFeedback = $1 WHERE meetingID = $2 RETURNING menteeID AS userID, meetingName", [feedback, req.params.meetingID]);
        }

        notifications.notify(result.rows[0].userid, `Feedback submitted by ${req.userInfo.name} for ${result.rows[0].meetingname}.`, 'Feedback Received');

        res.send('success');
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
        next();
    }
});

//Give feedback on a group meeting to the mentor that ran the meeting
router.post('/feedback/groupmeeting/:meetingID' , checkAuth, async (req, res, next) => {
    try{
        console.log("/feedback/groupmeeting/" + req.params.meetingID + "\n" + req.body);
        let feedback = req.body.feedback;
        await pool.query("INSERT INTO groupMeetingFeedback VALUES(DEFAULT, $1, $2)", [req.params.meetingID, feedback]); 
        res.send("success");
        next();
    }catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
});


// View feedback from the mentor or mentee for a one-to-one meeting 
router.get('/feedback/view/meeting/:meetingID',  checkAuth, async (req, res, next) => {
    try{
        console.log("/feedback/view/meeting/" + req.params.meetingID + "\n" + req.body);
        let results = null;
        let feedbackString = null;
        if(req.userInfo.userType === 'mentor'){
            results = await pool.query("SELECT * FROM meeting WHERE meetingID = $1 AND mentorID = $2", [req.params.meetingID, req.userInfo.userID]);
            feedbackString = results.rows[0].menteefeedback; 
        } else{
            results = await pool.query("SELECT * FROM meeting WHERE meetingID = $1 AND menteeID = $2", [req.params.meetingID, req.userInfo.userID]);
            feedbackString = results.rows[0].mentorfeedback;
        }
        let f = {
            feedback: feedbackString,
        }
        res.json([f]);
        next();
    }catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }    
});

// View feedback from mentees on a group meeting
router.get('/feedback/view/groupmeeting/:meetingID', checkAuth, async (req, res, next) =>{
    try {
        console.log("/feedback/view/groupmeeting/" + req.params.meetingID + "\n" + req.body);

        const results = await pool.query(getGroupMeetingFeedback, [req.params.meetingID, req.userInfo.userID]);
        let feedbackMessages = [];
        for(let i = 0; i < results.rowCount; ++i){
            let menteeFeedback = {
                feedback: results.rows[i].feedback
            };
            feedbackMessages.push(menteeFeedback);
        }
        console.log(feedbackMessages);
        res.json(feedbackMessages);
        next();
    } catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
});


module.exports = router;