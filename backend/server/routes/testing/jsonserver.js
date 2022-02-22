const router = require("express").Router();
const fs = require("fs");

// Page to create a meeting
router.get("/testdata/:filename", (req, res, next) => {
    const filename = req.params.filename;
    console.log(filename);
    const json = fs.readFileSync(__dirname + '/' + filename);
    console.log("File: ");
    console.log(json);
    res.send(json);
    next();
});

router.post("/testdata/:filename", (req, res, next) => {
    const filename = req.params.filename;
    console.log(filename);
    const json = fs.readFileSync(__dirname + '/' + filename);
    console.log("File: ");
    console.log(json);
    res.send(json);
    next();
});

module.exports = router;