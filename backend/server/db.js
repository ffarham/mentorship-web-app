// Here we initialise a database connection to the server.
const Pool = require("pg").Pool;

const connectionString= 'postgres://postgres:postgres@db:5432/discipulo'

/*
const pool = new Pool({
    connectionString,
})
*/

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "discipulo"   
});

module.exports = pool;