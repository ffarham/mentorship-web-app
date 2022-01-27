// Here we initialise a database connection to the server.
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "discipulo"   
});

module.exports = pool;