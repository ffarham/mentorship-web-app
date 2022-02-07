const router = require("express").Router();

// Page for the mentees assigned to the mentor
router.get("/mentor/:mentorid/mentees", (req, res) => {
    
});

// Get request to view a particular mentee (of the mentor)
router.get("/mentor/:mentorid/mentees/:menteeid", (req, res) => {

});

// The past meetings the mentor and a mentee have had
router.get("/mentor/:mentorid/mentees/:menteeid/pastmeetings", (req, res) => {

});


// The plan of action for a mentee
router.get("/mentor/:mentorid/mentees/:menteeid/plan", (req, res) => {

});

//Post request to comment on the plan
router.post("/mentor/:mentorid/mentees/menteeid/plan/comment", (req, res) => {
    
});

//Post request to comment on a milestone in the plan
router.post("/mentor/:mentorid/mentees/menteeid/plan/ms/:msid", (req, res) => {
    
});

