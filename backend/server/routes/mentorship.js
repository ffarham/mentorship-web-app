const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

router.get('/mentorship', checkAuth, async (req, res, next) => {
    var query;
    if (req.userInfo.loggedInAs === 'mentee') {
        query = 'SELECT users.* FROM users INNER JOIN mentoring ON mentoring.mentorID = users.userID WHERE users.userID = $1' 
    } else if (req.userInfo.loggedInAs === 'mentor') {
        query = 'SELECT users.* FROM users INNER JOIN mentoring ON mentoring.menteeID = users.userID WHERE users.userID = $1'
    }

    const otherUsersResult = await pool.query(query, [req.userInfo.userID]);

    var responseObject = [];
    var otherUserResult;
    var otherUser;
    for (var i = 0; i < otherUsersResult.rowCount; i++) {
        otherUserResult = otherUsersResult.rows[i];

        otherUser = {
            userID : otherUserResult.userid,
            name : otherUserResult.name,
        };
        
    }

    res.json(responseObject);
});

module.exports = router;

