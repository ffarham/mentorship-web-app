const pool = require("../db");

const router = require("express").Router();

// ADD ROUTES HERE
// e.g.
// router.post("sendData...", async (req, res) => {
//     try{

//     }catch(err){
//         console.log(err);
//         res.status(500).send("Server error")
//     }
// });

const findPasswordQuery = 'SELECT password FROM users;'

router.get("/", async (req, res) => {
    res.redirect("/home");
});

router.get("/home", async (req, res) =>{
    try{
        const result = await pool.query(findPasswordQuery);
        if(result.rowCount === 0){
            throw {name:'Error :('};
        }    
        //"This is the homepage" + 
        res.send(result.rows);
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;