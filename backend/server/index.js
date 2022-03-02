const express = require("express");
const app = express();
const cors = require("cors");

const https = require("https");
const fs = require("fs");

const privateKey = fs.readFileSync("sslcert/selfsigned.key", "utf-8");
const certificate = fs.readFileSync("sslcert/selfsigned.crt", "utf-8");
const httpsServer = https.createServer({key: privateKey, cert: certificate}, app);

const pool = require("./db");

const home = require("./routes/homepage.js");

const userInteractions = require('./interactions/users');
const tokens = require('./auth/tokens');

const available = require('./matching/matchable').AvailablePersons;
const Flag = require('./matching/matchable').Flag;
const Mentee = require('./matching/matchable').Mentee;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/", home);


// ROUTES
// e.g. app.use("/<route>", require("./routes/<filename>"))

app.use("/api/v1", require("./routes/testing/jsonserver"));
app.use("/api/v1", require("./routes/checkRefreshToken"));
app.use("/api/v1", require("./routes/login"));

// start listening on PORT 5000 
httpsServer.listen(5000, async () => {
    console.log("Server is running...");
    console.log("Listening on port 5000!\n");

    /*pool.query("SELECT userid FROM users WHERE name = 'Jimothy Bobson' OR name = 'Your Father'")
        .then(result => {
            let ids = []
            for(let i = 0; i < result.rowCount; ++i){
                ids.push(result.rows[i]["userid"]);
            }
            available.createMatches(ids);
        }, 
            result => {console.log("No such user exists")});
    */
    let resultsArray = [];
    setInterval(() => available.pollMatching(), 1000);
    console.log("got here");
    pool.query("SELECT userid FROM users WHERE name = 'Jimothy Bobson' or name = 'Your Father'")
        .then(async result => {
            for(let i = 0; i < result.rowCount; ++i){
                let mentee = new Mentee(result.rows[i]["userid"], null, null, null, null);
                console.log("mentee userid: " + mentee.userid);
                let flag = new Flag(mentee);
                console.log("flag userid: " + flag.getMentee().userid);
                available.addMentee(flag);
            }
            /*let resultCopy = new Array(resultsArray);
            console.log("printing resultCopy");
            for(let i = 0; i < resultCopy.length; ++i){
                console.log(resultCopy[i].first + ":");
                for(let j = 0; j < resultCopy[i].second.length; ++j){
                    console.log(resultCopy[i].second[j].second.second.name + ": " + 
                    resultCopy[i].second[j].first);
                }
            }*/
        }, 
            result => {console.log("No such user exists")});
    console.log("end me");
});