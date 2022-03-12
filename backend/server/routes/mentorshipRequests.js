const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');
const notify = require('../interactions/notifications');
const { restart } = require("nodemon");
const { route } = require("./homepage");

const insertRequest = "" +
"INSERT INTO mentorshipRequests VALUES (DEFAULT, $1, $2, DEFAULT)";

const getMentorshipRequests = "" + 
"SELECT * FROM mentorshipRequests where mentorID = $1";

/**
 * Send a request to the mentor speficied by the mentorID parameter to tutor a mentee
 */
router.post('/requestMentor/:mentorID', checkAuth, async (req, res, next) => {
    console.log("/requestMentor/" + req.params.mentorID + "\n" + req.body)
    let mentorID = req.params.mentorID;
    let menteeID = req.userInfo.userID;

    try{
        await pool.query(insertRequest, [mentorID, menteeID]);
    } catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }

    res.send("success");
    next(); 
});
/**
 * Get all requests from mentees to a mentor to tutor them.
 */
router.get('/mentorship/requests', checkAuth, async (req, res, next) => {
    console.log("/mentorship/requests\n" + req.body)
    try{
        let results = null;
        let isMentor = (req.userInfo.userType === 'mentor');
        if(isMentor){
            results = await pool.query("SELECT * FROM mentorshipRequests WHERE mentorID = $1", [req.userInfo.userID]);
        }
        else{
            results = await pool.query("SELECT * FROM mentorshipRequests WHERE menteeID = $1", [req.userInfo.userID]);
        }
        let mentorShipRequests = [];
        console.log(results.rows);
        for(let i = 0; i < results.rowCount; ++i){
            let row = results.rows[i];
            let userid = (isMentor) ? row.menteeid : row.mentorid;
            const result = await pool.query("SELECT * FROM users where userid = $1", [userid]);
            const userData = result.rows[0];
            
            const userInterests = await pool.query("SELECT * FROM interest where userid = $1", [userid]);
            let interestArr = [];
            for(let j = 0; j < userInterests.rowCount; ++j){
                interestArr.push(userInterests.rows[j].interest);
            }
            let mentorShipRequest = {
                id: row.requestid,
                user : {id: userid,
                email: userData.email,
                name: userData.name,
                department: userData.businessarea,
                bio: userData.bio,
                interests: interestArr
                }
            }
            mentorShipRequests.push(mentorShipRequest);
        }
        res.json(mentorShipRequests);
        next();
    } catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
});

/**
 * Accept a request to tutor a mentee
 */
router.post('/acceptMentee/:requestID', checkAuth, async (req, res, next) => {
    console.log("/acceptMentee/" + req.params.requestID + "\n" + req.body)
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
        console.log(err);
        res.status(500).json(err);
        next();
    }
    res.send("success");
    next();
});

/**
 * Reject a request to tutor a mentee
 */
router.post('/rejectMentee/:requestID', checkAuth, async (req, res, next) => {
    console.log("/rejectMentee/" + req.params.requestID + "\n" + req.body)
    try{
        let menteeResult = await pool.query("SELECT menteeid FROM mentorshipRequests WHERE requestID = $1", [req.params.requestID]);
        await pool.query("DELETE FROM mentorshipRequests WHERE requestid = $1", [req.params.requestID]);
        let menteeid = menteeResult.rows[0].menteeid;
        
        //notify mentee that their request has been rejected
        let mentorName = req.userInfo.name;
        notify(menteeid, "Your mentoring request to mentor " + mentorName + " has been rejected!");
        res.send("success");
    } catch(err){
        console.log(err);
        res.status(500).json(err);
        next();
    }
    next();
});

/**
 * Removes a user as the mentee of the tutor who sent the cancellation request
 */
router.post('/cancelMentorship/:mentorID', checkAuth, async (req, res, next) => {
    console.log("/cancelMentorship/" + req.params.mentorID + "\n" + req.body)
    try{
        let mentorid = req.params.mentorID;
        let menteeid = req.userInfo.userID;

        await pool.query("DELETE FROM mentoring WHERE mentorid = $1 AND menteeid = $2", [mentorid, menteeid]);
        await pool.query("DELETE FROM meeting WHERE mentorid = $1 AND menteeid = $2", [mentorid, menteeid]);
        await pool.query("DELETE FROM groupMeetingAttendee WHERE menteeid = $1", [menteeid]);
        await pool.query("DELETE FROM planOfAction WHERE mentorid = $1 AND menteeid = $2", [mentorid, menteeid]);

        notify(mentorid, req.userInfo.name + " is no longer your mentee");

    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
    res.send("success");
    next();
});


module.exports = router;