const router = require("express").Router();
const userInteractions = require('../interactions/users')
const tokens = require('../auth/tokens');

router.post('/registeruser', async (req, res, next) => {
    console.log("/registeruser\n" + req.body)
    //Register the user and pull their userID
    var userID;
    try {
        userID = await userInteractions.registerUser(req.body.email, req.body.name, req.body.password, req.body.department, req.body.userType, 'pfp', req.body.emailsAllowed, req.body.bio);
    } catch (err) {
        res.status(500).json(err);
        return;
    }

    //Register the user's interests
    try {
        //Register mentee interests
        for (var i = 0; i < req.body.interests.length; i++) {
            await userInteractions.registerInterest(userID, req.body.interests[i], 'mentee', i+1);
        }

        //Register mentor interests
        for (var i = 0; i < req.body.specialties.length; i++) {
            await userInteractions.registerInterest(userID, req.body.specialties[i], 'mentor', i+1);
        }
    } catch (err) {
        res.status(500).json(err);
        return;
    }
    
    res.send('Success!');
    next();
})

module.exports = router;