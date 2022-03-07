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
const { AvailablePersons } = require("./matching/matchable");

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
app.use("/api/v1/", require("./routes/matching/matching"));

// start listening on PORT 5000 
httpsServer.listen(5000, async () => {
    console.log("Server is running...");
    console.log("Listening on port 5000!\n");

    setInterval(() => available.pollMatching(), 1000);
    //console.log("weighted cost: " + available.calculateWeightedCost(1, 0, 5));
    
});
