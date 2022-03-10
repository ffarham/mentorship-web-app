const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');
const notify = require('../interactions/notifications');
const { restart } = require("nodemon");

const insertRequest = "" +
"INSERT INTO mentorshipRequests VALUES (DEFAULT, $1, $2, DEFAULT)";

const getMentorshipRequests = "" + 
"SELECT * FROM mentorshipRequests where mentorID = $1";


router.post('/requestMentor/:mentorID', checkAuth, async (req, res, next) => {
    let mentorID = req.params.mentorID;
    let menteeID = req.userInfo.userID;

    try{
        await pool.query(insertRequest, [mentorID, menteeID]);
    } catch(err){
        res.status(500).json(err);
        next();
    }

    res.send("success");
    next(); 
});

router.get('/getMentorshipRequests', checkAuth, async (req, res, next) => {
    try{
        const result = await pool.query(getMentorshipRequests, [req.userInfo.userID]);
        let mentorShipRequests = [];
        for(let i = 0; i < result.rowCount; ++i){
            let row = result.rows[i];

            let mentorShipRequest = {
                requestID: row.requestid,
                mentorID: row.mentorid,
                menteeID: row.menteeid,
                status: row.status
            }
            mentorShipRequests.push(mentorShipRequest);
        }
        res.json(mentorShipRequests);
        next();
    } catch(err){
        res.status(500).json(err);
        next();
    }
});

router.post('/acceptMentee/:requestID', checkAuth, async (req, res, next) => {
    try{
        const result = await pool.query("SELECT * FROM mentorshipRequests WHERE requestid = $1", [req.params.requestID]);
        let mentorid = req.userInfo.userID;
        let menteeid = result.rows[0].menteeid;

        await pool.query("INSERT INTO mentoring VALUES($1, $2)", [mentorid, menteeid]);

        await pool.query("DELETE FROM mentorshipRequests WHERE requestid = $1", [req.params.requestID]);
        
        const mentorResult = await pool.query("SELECT name FROM users WHERE userid = $1", [mentorid]);
        let mentorName = mentorResult.rows[0].name;

        //notify mentee that their request has been accepted
        notify(menteeid, "Your mentoring request to mentor " + mentorName + " has been accepted!");
    } catch(err){
        res.status(500).json(err);
        next();
    }
    res.send("success");
    next();
});

router.post('/rejectMentee/:requestID', checkAuth, async (req, res, next) => {
    try{
        await pool.query("UPDATE mentorshipRequests SET status = 'rejected' WHERE requestID = $1", [req.params.requestID]);
        let menteeResult = await pool.query("SELECT menteeid FROM mentorshipRequests WHERE requestID = $1", [req.params.requestID]);
        let menteeid = menteeResult.rows[0].menteeid;
        
        //notify mentee that their request has been rejected
        let mentorName = req.userInfo.name;
        notify(menteeid, "Your mentoring request to mentor " + mentorName + " has been rejected!");
        res.send("success");
    } catch(err){
        res.status(500).json(err);
        next();
    }
    next();
});

router.post('/cancelMentorship/:mentorID', checkAuth, async (req, res, next) => {
    try{
        let mentorid = req.params.mentorID;
        let menteeid = req.userInfo.userID;

        await pool.query("DELETE FROM mentoring WHERE mentorid = $1 AND menteeid = $2", [mentorid, menteeid]);
        await pool.query("DELETE FROM meeting WHERE mentorid = $1 AND menteeid = $2", [mentorid, menteeid]);
        await pool.query("DELETE FROM groupMeetingAttendee WHERE menteeid = $1", [menteeid]);
        await pool.query("DELETE FROM planOfAction WHERE mentorid = $1 AND menteeid = $2", [mentorid, menteeid]);

        notify(mentorid, req.userInfo.name + " is no longer your mentee");

    } catch(err){
        res.status(500).json(err);
    }
    res.send("success");
    next();
});



module.exports = router;