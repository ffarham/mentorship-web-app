const router = require("express").Router();
const checkAuth = require('../auth/checkAuth');
const pool = require('../db.js');
const notifications = require('../interactions/notifications');

router.post('/createPOA/:menteeID', checkAuth, async (req, res, next) => {
    console.log("/createPOA/" + req.params.menteeID+ "\n" + req.body)
    try {
        if (req.userInfo.userType === 'mentee') {
            throw {name: 'WrongUserTypeError', message: 'User must be logged in as a mentor to create a plan of action'}
        }

        //Add the new plan of action to the database
        await pool.query('INSERT INTO planOfAction VALUES (DEFAULT, $1, $2, $3, $4, FALSE)', [req.userInfo.userID, req.params.menteeID, req.body.planName, req.body.planDescription]);

        //Notify the user
        notifications.notify(req.params.menteeID, `New Plan of Action created by ${req.userInfo.name}.`, 'Plan Created');

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

    next();
});

router.post('/createMilestone/:planID', checkAuth, async (req, res, next) => {
    console.log("/createMilestone/" + req.params.planID + "\n" + req.body)
    try {
        //Find the ordering of this milestone in the POA 
        const result = await pool.query('SELECT MAX(ordering) FROM milestones WHERE planID = $1', [req.params.planID]);

        const ordering = result.rowCount === 0 ? 0 : result.rows[0].max + 1;

        //Insert the new milestone into the database
        await pool.query('INSERT INTO milestones VALUES (DEFAULT, $1, $2, $3, $4, FALSE)', [req.params.planID, ordering, req.body.milestoneName, req.body.milestoneDescription]);

        res.send('Success!');
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }

    next();
});

router.get('/plan-of-actions', checkAuth, async (req, res, next) => {
    console.log("/plan-of-actions\n" + req.body)
    try {
        //Pull all user's plans from the database
        const planResult = await pool.query('SELECT * FROM planOfAction INNER JOIN users ON planOfAction.mentorID = users.userID WHERE planOfAction.menteeID = $1', [req.userInfo.userID]);

        //For each plan in the database, format it and pull the corresponding milestones
        var plansOfAction = [];
        var row;
        for (var i = 0; i < planResult.rowCount; i++) {
            row = planResult.rows[i];

            //Format appropriately
            var planOfAction = {
                planID: row.planid,
                mentorName: row.name,
                menteeName: req.userInfo.name,
                planName: row.planname,
                planDescription: row.plandescription,
                completed: row.completed
            };

            //Pull all associated milestones from the database
            const milestoneResult = await pool.query('SELECT * FROM milestones WHERE planID = $1 ORDER BY ordering', [row.planid]);
            
            //For each milestone, format it and attach it to the planOfAction object
            var milestones = [];
            var row2;
            for (var j = 0; j < milestoneResult.rowCount; j++) {
                row2 = milestoneResult.rows[j];

                //Format appropriately
                const milestone = {
                    milestoneID: row2.milestoneid,
                    milestoneName: row2.milestonename,
                    milestoneDescription: row2.milestonedescription,
                    completed: row2.completed
                }

                //Add to list of milestones
                milestones.push(milestone);
            }

            //Append milestones and add to list of plans
            planOfAction.milestones = milestones;
            plansOfAction.push(planOfAction);
        }

        res.json(plansOfAction);
        next();
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
        next();
    }
});

router.post('/markPOAcomplete/:planID', checkAuth, async (req, res, next) => {
    console.log("/markPOAcomplete/" + req.params.planID+ "\n" + req.body)
    try {
        //Mark the POA as complete
        const result = await pool.query('UPDATE planOfAction SET completed = TRUE WHERE planID = $1 AND mentorID = $2 RETURNING menteeID, planName', [req.params.planID, req.userInfo.userID]);
        
        //Notify the mentee
        notifications.notify(result.rows[0].menteeid, `${result.rows[0].planname} complete!`, 'Plan Completed');

        res.send('Success!');
        next();
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
        return;
    }

})

router.post('/markMilestoneComplete/:milestoneID', checkAuth, async (req, res, next) => {
    console.log("/markMilestoneComplete/" + req.params.milestoneID + "\n" + req.body)
    try {        
        //Mark the milestone as complete
        await pool.query('UPDATE milestones SET completed = TRUE WHERE milestoneID = (SELECT milestones.milestoneID FROM milestones INNER JOIN planOfAction ON milestones.planID = planOfAction.planID WHERE milestones.milestoneID = $1 AND planOfAction.mentorID = $2)', [req.params.milestoneID, req.userInfo.userID]);

        res.send('Success!');
        next();
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
        return;
    }
});


module.exports = router;