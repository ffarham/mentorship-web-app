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

const test = require("./routes/testing/jsonserver");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/", home);

app.use("/api/v1", test);

// ROUTES
// e.g. app.use("/<route>", require("./routes/<filename>"))

// start listening on PORT 5000 
httpsServer.listen(5000, () => {
    console.log("Server is running...")
    console.log("Listening on port 5000!")
});