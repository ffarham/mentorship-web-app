const router = require("express").Router();
const userInteractions = require('../interactions/users')

router.post('/registeruser', async (req, res, next) => {
    //Register the user and pull their userID
    var userID;
    try {
        userID = userInteractions.registerUser(req.body.email, req.body.name, req.body.password, req.body.businessArea, req.body.userType, 'pfp', req.body.emailsAllowed);
    } catch (err) {
        res.status(500).json(err);
        next();
    }

    //Register the user's interests
    //TODO: Check with Farham
    try {
        for (var i = 0; i < req.body.interests; i++) {
            userInteractions.registerInterest(userID, req.body.interests[i].interest, req.body.interests[i].type);
        }
    } catch (err) {
        res.status(500).json(err);
    }

    next();
})