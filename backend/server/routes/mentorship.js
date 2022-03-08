const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

router.get('/mentorship', checkAuth, async (req, res, next) => {
    var query;
    if (req.userInfo.loggedInAs === 'mentee') {

    } else if (req.userInfo.loggedInAs === 'mentor') {

    }
});

