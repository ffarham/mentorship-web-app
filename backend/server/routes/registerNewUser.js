const router = require("express").Router();
const userInteractions = require('../interactions/users')
const tokens = require('../auth/tokens');

//Get the lists of allowed departments and topics
router.get('/register', async (req, res, next) => {
    const vals = [
        'Research',
        'Risk',
        'Marketing',
        'Sales',
        'Equity',
        'M&A',
        'Stocks',
        'Bonds',
        'Value',
        'MutualFund',
        'IPO',
        'Mortgage',
        'HFT',
        'Quant',
        'Analysis',
        'MarketMaking'
    ];
    res.json({
        departments : vals,
        topics : vals
    });
});

//Register a new user
router.post('/registeruser', async (req, res, next) => {
    console.log("/registeruser\n" + req.body)
    //Register the user and pull their userID
    var userID;
    try {
        userID = await userInteractions.registerUser(req.body.email, req.body.name, req.body.password, req.body.department, req.body.userType, 'pfp', false, req.body.bio);
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
        console.log(err);
        res.status(500).json(err);
        return;
    }
    
    res.send('Success!');
    next();
})

module.exports = router;