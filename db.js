const config = require('./config.json');
var options = {
    //initialization options;
};
var pgp = require('pg-promise')(options);
if ( process.env.DATABASE_URL ) {
    var connection = {
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
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
var db = pgp(connection);
console.log('Connecting to Postgres at postgres://'
        + connection.user + '.'
        + connection.password + '@'
        + connection.host + ':'
        + connection.port + '/'
        + connection.database );
module.exports = db;
