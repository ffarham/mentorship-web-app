const router = require("express").Router();
const userInteractions = require('../interactions/users')
const tokens = require('../auth/tokens');

router.post('/registeruser', async (req, res, next) => {
    //Register the user and pull their userID
    var userID;
    try {
        userID = await userInteractions.registerUser(req.body.email, req.body.name, req.body.password, req.body.department, req.body.userType, 'pfp', req.body.emailsAllowed);
    } catch (err) {
        res.status(500).json(err);
        return;
    }

    //Register the user's interests
    try {
        //Register mentee interests
        for (var i = 0; i < req.body.interests.length; i++) {
            console.log("Registering interest = " + req.body.interests[i])
            await userInteractions.registerInterest(userID, req.body.interests[i], 'mentee', i);
        }

        //Register mentor interests
        for (var i = 0; i < req.body.specialties.length; i++) {
            console.log("Registering specialty = " + req.body.specialties[i])
            await userInteractions.registerInterest(userID, req.body.specialties[i], 'mentor', i);
        }
    } catch (err) {
        res.status(500).json(err);
        return;
    }
    
    next();
})

module.exports = router;