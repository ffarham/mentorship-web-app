const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

//Pull all a users' mentees/mentors
router.get('/mentorship', checkAuth, async (req, res, next) => {
    console.log("/mentorship\n" + req.body)
    try {
        //Pull the appropriate user info from the database
        var usersQuery;
        if (req.userInfo.userType === 'mentee') {
            usersQuery = 'SELECT users.* FROM users INNER JOIN mentoring ON mentoring.mentorID = users.userID WHERE mentoring.menteeID = $1' 
        } else if (req.userInfo.userType === 'mentor') {
            usersQuery = 'SELECT users.* FROM users INNER JOIN mentoring ON mentoring.menteeID = users.userID WHERE mentoring.mentorID = $1'
        }

        const otherUsersResult = await pool.query(usersQuery, [req.userInfo.userID]);

        //Format the results nicely and append the plans of action and the meetings
        var responseObject = [];
        var otherUserResult;
        var otherUser;
        for (var i = 0; i < otherUsersResult.rowCount; i++) {
            otherUserResult = otherUsersResult.rows[i];

            //Format user info nicely
            otherUser = {
                otherID : otherUserResult.userid,
                name : otherUserResult.name,
                bio : otherUserResult.bio,
                email : otherUserResult.email,
                department : otherUserResult.businessarea,
                interests : []
            };

            //Pull the other user's interests
            const interestsResult = await pool.query('SELECT interest FROM interest WHERE userID = $1 AND kind = $2', [otherUser.otherID, req.userInfo.userType === 'mentee' ? 'mentor' : 'mentee']);

            //Add to the otherUser object
            for (var j = 0; j < interestsResult.rowCount; j++) {
                otherUser.interests.push(interestsResult.rows[j].interest);
            }
            console.log(otherUser);
            //Add user to the response
            responseObject.push(otherUser);
        }

        //Send the response
        res.json(responseObject);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//Pull a mentor's own specialties
router.get('/mentor/specialties', checkAuth, async (req, res, next) => {
    try {
        const result = await pool.query('SELECT interest FROM interest WHERE userID = $1 AND kind = \'mentor\'', [req.userInfo.userID]);

        var responseObject = [];
        for (var i = 0; i < result.rowCount; i++) {
            responseObject.push(result.rows[i].interest);
        }

        res.json(responseObject);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//Get all the meetings that have been confirmed
router.get('/meetings/meetings', checkAuth, async (req, res, next) => {
    console.log("/meetings/meetings\n" + req.body);
    try {
        //Pull all the meetings from the database
        
        //Choose the right query
        var meetingsQuery;
        if (req.userInfo.userType === 'mentee') {
            meetingsQuery = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR AS durationString, meeting.place, meeting.confirmed, meeting.attended::INTEGER, meeting.description, meeting.mentorFeedback AS feedback, meeting.requestMessage, meeting.status
                FROM meeting 
                INNER JOIN users ON meeting.mentorID = users.userID 
                WHERE meeting.menteeID = $1 AND meeting.confirmed != \'false\')
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, users.name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS attended, groupMeeting.description, '' AS feedback, '' AS requestMessage, groupMeeting.status
                FROM groupMeeting 
                INNER JOIN users ON groupMeeting.mentorID = users.userID
                INNER JOIN groupMeetingAttendee ON groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID 
                WHERE groupMeetingAttendee.menteeID = $1 AND groupMeetingAttendee.confirmed = TRUE) 
                
            ORDER BY meetingStart DESC
            `;
        } else if (req.userInfo.userType === 'mentor') {
            meetingsQuery = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR AS durationString, meeting.place, meeting.confirmed, meeting.attended::INTEGER, meeting.description, meeting.mentorFeedback AS feedback, meeting.requestMessage, meeting.status
                FROM meeting 
                INNER JOIN users ON meeting.menteeID = users.userID 
                WHERE meeting.mentorID = $1 AND meeting.confirmed != \'false'\ AND meeting.status != 'pending')
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, 'Several' AS name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS attended, groupMeeting.description, '' AS feedback, '' as requestMessage, groupMeeting.status
                FROM groupMeeting
                WHERE groupMeeting.mentorID = $1) 
                
            ORDER BY meetingStart DESC
            `;
        }

        //Run the query
        const meetingsResult = await pool.query(meetingsQuery, [req.userInfo.userID]);

        //Format the results
        var responseObject = [];
        var meetingResult;
        for (var i = 0; i < meetingsResult.rowCount; i++) {
            meetingResult = meetingsResult.rows[i];
            let meeting = {
                meetingID : meetingResult.meetingid,
                meetingType : meetingResult.meetingtype,
                meetingName : meetingResult.meetingname,
                mentorName : req.userInfo.userType === 'mentor' ? req.userInfo.name : meetingResult.name,
                menteeName : req.userInfo.userType === 'mentee' ? req.userInfo.name : meetingResult.name,
                meetingStart : meetingResult.startstring,
                meetingDuration : meetingResult.durationstring,
                place : meetingResult.place,
                confirmed : meetingResult.confirmed,
                status: meetingResult.status,
                complete : meetingResult.attended,
                meetingDescription : meetingResult.description,
                requestMessage : meetingResult.requestMessage
            }

            console.log(meeting.meetingStart);
            console.log(meeting.meetingDuration);

            //Add meeting to user info
            responseObject.push(meeting);
        }

        //Send the response
        res.json(responseObject);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//Pulls all the meetings that a user has with another user
router.get('/meetings/mentorship/:otherID', checkAuth, async (req, res, next) => {
    try {
        console.log("/meetings/mentorship/" + req.params.otherID +"\n" + req.body);
        //Pull all the meetings from the database
        
        //Choose the right query
        var meetingsQuery;
        if (req.userInfo.userType === 'mentee') {
            meetingsQuery = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR AS durationString, meeting.place, meeting.confirmed, meeting.attended, meeting.description, meeting.mentorFeedback, meeting.status AS feedback
                FROM meeting 
                INNER JOIN users ON meeting.mentorID = users.userID 
                WHERE meeting.menteeID = $1 AND meeting.mentorID = $2)
                
            UNION 
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, users.name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, groupMeeting.place, 'true' AS confirmed, countAttendees(groupMeeting.groupMeetingID) AS confirmed, groupMeeting.description, groupMeeting.status, '' AS feedback
                FROM groupMeeting 
                INNER JOIN users ON groupMeeting.mentorID = users.userID
                INNER JOIN groupMeetingAttendee ON groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID 
                WHERE groupMeetingAttendee.menteeID = $1 AND groupMeeting.mentorID = $2) 
                
            ORDER BY meetingStart DESC
            `;
        } else if (req.userInfo.userType === 'mentor') {
            meetingsQuery = `
            (SELECT meeting.meetingID, 'meeting' AS meetingType, users.name, meeting.meetingName, meeting.meetingStart, meeting.meetingStart::VARCHAR AS startString, meeting.meetingDuration::VARCHAR AS durationString, meeting.place, meeting.confirmed, meeting.attended, meeting.description, meeting.status, meeting.mentorFeedback AS feedback
                FROM meeting 
                INNER JOIN users ON meeting.menteeID = users.userID 
                WHERE meeting.mentorID = $1 AND meeting.menteeID = $2)
                
            UNION
            
            (SELECT groupMeeting.groupMeetingID AS meetingID, groupMeeting.kind AS meetingType, 'Several' AS name, groupMeeting.groupMeetingName AS meetingName, groupMeeting.meetingStart, groupMeeting.meetingStart::VARCHAR AS startString, groupMeeting.meetingDuration::VARCHAR AS durationString, groupMeeting.place, 'true' AS confirmed, groupMeeting.attended, groupMeeting.description, groupMeeting.status, '' AS feedback
                FROM groupMeeting 
                INNER JOIN groupMeetingAttendee ON groupMeetingAttendee.groupMeetingID = groupMeeting.groupMeetingID
                WHERE groupMeeting.mentorID = $1 AND groupMeetingAttendee.menteeID = $2) 
                
            ORDER BY meetingStart DESC
            `;
        }

        //Run the query
        const meetingsResult = await pool.query(meetingsQuery, [req.userInfo.userID, req.params.otherID]);

        //Format the results
        var responseObject = [];
        var meetingResult;
        for (var i = 0; i < meetingsResult.rowCount; i++) {
            meetingResult = meetingsResult.rows[i];

            //Add meeting to user info
            responseObject.push({
                meetingID : meetingResult.meetingid,
                meetingType : meetingResult.meetingtype,
                meetingName : meetingResult.meetingname,
                mentorName : req.userInfo.userType === 'mentor' ? req.userInfo.name : meetingResult.name,
                menteeName : req.userInfo.userType === 'mentee' ? req.userInfo.name : meetingResult.name,
                meetingStart : meetingResult.startstring,
                meetingDuration : meetingResult.duationstring,
                place : meetingResult.place,
                confirmed : meetingResult.confirmed,
                status: meetingResult.status,
                complete : meetingResult.attended,
                meetingDescription : meetingResult.description
            });
        }

        //Send the response
        res.json(responseObject);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//Pulls all the plans of action a user has with another user
router.get('/mentorship/plan-of-actions/:otherID', checkAuth, async (req, res, next) => {
    console.log("/mentorship/plan-of-actions/" + req.params.otherID+ "\n" + req.body);
    try {
        var responseObject = [];
        
        //Pull the plans of action from the database
        var poaQuery;
        if (req.userInfo.userType === 'mentee') {
            poaQuery = 'SELECT * FROM planOfAction INNER JOIN users ON planOfAction.mentorID = users.userID WHERE planOfAction.menteeID = $1 AND planOfAction.mentorID = $2';
        } else if (req.userInfo.userType === 'mentor') {
            poaQuery = 'SELECT * FROM planOfAction INNER JOIN users ON planOfAction.menteeID = users.userID WHERE planOfAction.mentorID = $1 AND planOfAction.menteeID = $2';
        }

        const planResult = await pool.query(poaQuery, [req.userInfo.userID, req.params.otherID]);

        //Format plan information and attach milestones
        var planRow;
        var planOfAction;
        for (var j = 0; j < planResult.rowCount; j++) {
            planRow = planResult.rows[j];
            
            //Format appropriately
            planOfAction = {
                planID: planRow.planid,
                mentorName: req.userInfo.userType === 'mentor' ? req.userInfo.name : planRow.name,
                menteeName: req.userInfo.userType === 'mentee' ? req.userInfo.name : planRow.name,
                planName: planRow.planname,
                planDescription: planRow.plandescription,
                completed: planRow.completed,
                milestones: []
            };

            //Pull all associated milestones from the database
            const milestoneResult = await pool.query('SELECT * FROM milestones WHERE planID = $1 ORDER BY ordering', [planRow.planid]);

            //Format milestones appropriately
            var milestoneRow;
            for (var k = 0; k < milestoneResult.rowCount; k++) {
                milestoneRow = milestoneResult.rows[k];

                //Format appropriately
                const milestone = {
                    milestoneID: milestoneRow.milestoneid,
                    milestoneName: milestoneRow.milestonename,
                    milestoneDescription: milestoneRow.milestonedescription,
                    completed: milestoneRow.completed
                }

                //Add milestone to the plan of action
                planOfAction.milestones.push(milestone);
            }

            //Add plan of action to the user's info
            responseObject.push(planOfAction);
        }

        res.json(responseObject);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    } 

    next();
});

module.exports = router;