const express = require("express");
const app = express();
const cors = require("cors");

const https = require("https");
const fs = require("fs");

const privateKey = fs.readFileSync("sslcert/selfsigned.key", "utf-8");
const certificate = fs.readFileSync("sslcert/selfsigned.crt", "utf-8");
const httpsServer = https.createServer({key: privateKey, cert: certificate}, app);

const pool = require("./db");

const userInteractions = require('./interactions/users');
const tokens = require('./auth/tokens');
const mentorshipRequests = require('./routes/mentorshipRequests');
const { AvailablePersons } = require("./matching/matchingSystem");

const available = require('./matching/matchingSystem').pairMatching;
const Flag = require('./matching/matchingSystem').Flag;
const Mentee = require('./matching/matchingSystem').Mentee;

const suggestWorkshops = require('./interactions/suggestWorkshops').suggestWorkshops;


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES
// e.g. app.use("/<route>", require("./routes/<filename>"))

//String to prepend to all endpoints
const apiString = "/api/v1"

app.use(apiString, require("./routes/checkRefreshToken")); //Endpoint to issue new access tokens
app.use(apiString, require("./routes/login")); //Endpoint for logins
app.use(apiString, require("./routes/registerNewUser")); //Endpoint for user registration
app.use(apiString, require("./routes/planOfAction")); //Endpoints for plans of action
app.use(apiString, require("./routes/home")); //Endpoints for user's home page
app.use(apiString, require("./routes/matching/matching")); //Endpoints for matchings
app.use(apiString, require("./routes/mentorshipRequests")); //Endpoints for mentorship requests
app.use(apiString, require("./routes/settings/settings")); //Endpoints for settings
app.use(apiString, require('./routes/meetings')); //Endpoints for meetings
app.use(apiString, require("./routes/mentorship")); //Endpoints for the mentorship page


// start listening on PORT 5000 
httpsServer.listen(5000, async () => {
    console.log("Server is running...");
    console.log("Listening on port 5000!\n");

    setInterval(() => available.pollMatching(), 500); //Poll matching every 0.5 seconds
    setInterval(suggestWorkshops, 8640000); //Suggest workshops every 24 hours
    setInterval(() => pool.query('DELETE FROM authToken WHERE timeCreated + timeToLive < NOW()'), 600000); //Delete old tokens every 10 minutes

});
