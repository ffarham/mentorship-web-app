const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');

router.post('/createMeeting', checkAuth, async (req, res, next) => {

});

router.post('/createGroupMeeting', checkAuth, async (req, res, next) => {

});

router.post('/rescheduleMeeting/:meetingID', checkAuth, async (req, res, next) => {
    
});

router.post('/meetingUpdate/:meetingID', checkAuth, async (req, res, next) => {

});


router.post('/cancelMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {

});

router.post('/acceptMeeting/:meetingID/:meetingType', checkAuth, async (req, res, next) => {

});

router.post('/rejectMeeting/:groupMeetingID', checkAuth, async (req, res, next) => {
    
});

module.exports = router;