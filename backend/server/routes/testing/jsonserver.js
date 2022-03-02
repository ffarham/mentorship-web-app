const router = require("express").Router();
const fs = require("fs");
const checkAuth = require('../../auth/checkAuth');

router.get("/testdata/:filename", (req, res, next) => {
    const filename = req.params.filename;
    console.log(filename);
    const json = fs.readFileSync(__dirname + '/' + filename);
    console.log("File: ");
    console.log(json);
    res.send(json);
    next();
});

router.post("/testdata/:filename", checkAuth, (req, res, next) => {
    const filename = req.params.filename;
    console.log(filename);
    const json = fs.readFileSync(__dirname + '/' + filename);
    console.log("File: ");
    console.log(json);

    console.log("user info:");
    console.log(req.userInfo);

    res.send(json);
    next();
});

module.exports = router;