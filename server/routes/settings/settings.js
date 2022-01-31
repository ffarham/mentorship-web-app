// The main page from which profile, account, appearance (for accessibility),
// the feedback form for the whole site and logging out can be accessed.

const router = require("express").Router();


//----GET ROUTES----

// Settings
router.get("/user/:userid/settings", (req, res) => {

});

// The user's profile
router.get("/user/:userid/profile", (req, res) => {

});

// The user's account details (email, password, delete account)/
router.get("/user/:userid/account", (req, res) => {

});

// Appearance of the site for the user
router.get("/user/:userid/appearance", (req, res) => {

});

// Feedback form for the whole site
router.get("/user/:userid/feedback", (req, res) => {

});


//----POST ROUTES ---

// Save changes to the profile page.
router.post("/user/:userid/profile", (req, res) => {

});

// Save changes to password
router.post("/user/:userid/account", (req, res) => {

});


//Submit request to delete the account (pop-up window)
router.post("/user/:userid/account/delete", (req, res) => {

});

// Save changes to site's appearance
router.post("/user/:userid/appearance", (req, res) => {

});

// Submit feedback
router.post("/user/:userid/feedback", (req, res) => {

});