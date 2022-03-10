const router = require("express").Router();
const pool = require('../db');
const checkAuth = require('../auth/checkAuth');
const notify = require('../interactions/notifications');
const { restart } = require("nodemon");


router.get("/api/v1/settings/:userID", async (req,res) => {

});


router.post("/api/v1/feedback", async (req,res, next) => {
    try{

    }catch(err){
        res.status(500).json(err);
        next()
    }



});






module.exports = router;