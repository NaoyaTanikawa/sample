const config = require('./config.json');
const url = require('url');
var options = {
    //initialization options;
};
var pgp = require('pg-promise')(options);
if ( process.env.DATABASE_URL ) {
    var pgurl = url.parse( process.env.DATABASE_URL, false );
    pgurl[username] = pgurl.auth.split(':')[0];
    pgurl[password] = pgurl.auth.split(':')[1];
    pgurl[database] = pgurl.pathname('/')[1]
    var connection = {
        host: pgurl.hostname,
        port: pgurl.port,
        database: pgurl.database,
        user: pgurl.username,
        password: pgurl.password
    };
} else {
    var connection = {
        host: config.hostname,
        port: 5432,
        database: config.database,
        user: config.username,
        password: config.password
    };
}
console.log('Connecting to Postgres at postgres://'
        + connection.user + '.'
        + connection.password + '@'
        + connection.host + ':'
        + connection.port + '/'
        + connection.database );
var db = pgp(connection);
module.exports = db;
