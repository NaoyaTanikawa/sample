const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const user = require('./routes/user');
router.use('/user', user);
app.use('/api', router);
const pg = require('pg');
const PORT = process.env.PORT || 3001;
var db = require('./db');

var result = "";
app.get('/', function(request, response) {
    /*
    db.any("select * from salesforce.Account")
        .then( function(data) {
            result = JSON.stringify(data);

            //console.log(data);
        })
        .catch( function(error) {
            console.log(error);
        });
        */
    response.send(result);
})

app.listen(PORT);
if( process.env.PORT ) {
    console.log('Server is running at ' + PORT + '/');
} else {
    console.log('Server is running at ' + 'http://localhost:' + PORT + '/');
}

/*
db.any("select * from salesforce.Account")
    .then( function(data) {
        console.log(data);
    })
    .catch( function(error) {
        console.log(error);
    });
*/
