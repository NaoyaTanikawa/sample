const config = require('./config.json');
const url = require('url');
var options = {
    //initialization options;
};
var pgp = require('pg-promise')(options);
if ( process.env.DATABASE_URL ) {
    const pgurl = url.parse( process.env.DATABASE_URL, false );
    const auth = pgurl.auth.split(':');
    var connection = {
        host: pgurl.hostname,
        port: pgurl.port,
        database: pgurl.pathname,
        user: auth[0],
        password: auth[1]
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
