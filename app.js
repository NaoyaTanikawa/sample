const http = require('http');
const express = require('express');
var app = express();
var router = express.Router();
var user = require('./routes/user');
var search = require('./routes/search.js');
router.use('/search', search);
router.use('/users', user);
app.use('/api', router);
const PORT = process.env.PORT || 3001;
//const pg = require('pg');
var db = require('./db');
//const bodyParser = require('body-parser');

//変数の用意
var result = "";

//テンプレートエンジンの設定
app.set('views', './views');
app.set('view engine','ejs');

//ミドルウェアの設定
app.use('public', express.static('public'));
//app.use(bodyParser.urlencoded({ extended:true }));
//app.use(bodyParser.json());

//ルーティング基本設定
app.get('/', function(request, response) {
    db.any("select * from salesforce.Account")
        .then( function(data) {
            result = JSON.stringify(data);
            //console.log(data);
        })
        .catch( function(error) {
            console.log(error);
        });
    //response.send(result);
    response.render("index",{});
})

//サーバの起動
app.listen(PORT);
if( process.env.PORT ) {
    console.log('Server is running at ' + PORT + '/');
} else {
    console.log('Server is running at ' + 'http://localhost:' + PORT + '/');
}
