const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

router.post('/requstMentor/:mentorID', checkAuth, async (req, res, next) => {

});

router.get('/getMentorshipRequests', checkAuth, async (req, res, next) => {

});

router.post('/acceptMentee/:requestID', checkAuth, async (req, res, next) => {

});

router.post('/rejectMentee/:requestID', checkAuth, async (req, res, next) => {

});

router.post('/cancelMentorship/:mentorID', checkAuth, async (req, res, next) => {
    
});



module.exports = router;