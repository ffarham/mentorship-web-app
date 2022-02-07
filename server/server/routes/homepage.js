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

router.get("/", async (req, res) => {
    res.redirect("/home");
});

router.get("/home", async (req, res) =>{
    try{
        res.send("This is the homepage");
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;