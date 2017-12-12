const Iconv = require('iconv').Iconv;
const iconv = new Iconv('SHIFT_JIS','UTF-8');

const express = require('express');
var router = express.Router();

const pg = require('pg');

var str = 'お試しcode\n';
var http = require("http");

const PORT = process.env.PORT || 3001;

app.get('/db', function(request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM salesforce.Account', function(err, result) {
            done();
            if( err ) {
                console.error(err);
                response.send("Error " + err);
            } else {
                response.render('page/db', {results : result.rows});
            }
        });
    });
});
/*
http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end(str);
}).listen(PORT);
*/
console.log('Server is runnning at http://localhost:' + PORT + '/');

//process.exit();


var loginUser = {};

router.post('/', function(req, res) {
    var func = req.body["func"];
    if( func == "login" ) {
        login(req, res);
    } else if( func == "cancel" ) {
        cancel(req, res);
    }
});

//ログイン時
function login(req, res){
	var email = req.body["email"].trim();
	var pass = req.body["password"].trim();

	pg.connect(process.env.DATABASE_URL, function(err, conn, done){
		conn.query(
			//ログインユーザとして、取引先責任者を取得（メールアドレスとパスワードで識別）
			'SELECT Id, sfid, FirstName, LastName, Email, Phone, Password__c FROM salesforce.Contact WHERE IsDeleted = false AND LOWER(Email) = LOWER($1) AND Password__c = $2 ORDER BY CreatedDate Desc LIMIT 1',
			[email, pass],
			function(err, result){
				//console.log("■line:45" + JSON.stringify(result));
				//失敗
				if(err != null || result.rowCount == 0){
					var errStr = (err) ? err.message : "アカウントが存在しません。";
					res.status(400).json({error: errStr});
					res.render('ReservationList.ejs',
					{
						rows: []
						,isCanceled: false
					});
				//成功
				}else{
					//ログインユーザ（取引先責任者）を格納しておく
					loginUser = result.rows[0];

					//ログインユーザの取引先責任者から来訪予約を取得
					getReservations(req, res, conn, done, false);
				}
			}
		);
		done();
	});
	pg.end();
}

/**
 * ログインユーザの取引先責任者から来訪予約を取得
 * @param {boolean} isCanceled キャンセルしての画面遷移かどうか
 */
function getReservations(req, res, conn, done, isCanceled){
	conn.query(
		'SELECT Id, sfid, Cancel__c, Contact__c, PurposeOfVisit__c, Remarks__c, VisitDate__c, VisitedStores__c FROM salesforce.Reservation__c WHERE IsDeleted = false AND Contact__c = $1 AND Cancel__c = false',
		[loginUser.sfid],
		function(err, result){
			//失敗
			if(err != null || result.rowCount == 0){
				res.render('ReservationList.ejs',
				{
					rows: []
					,isCanceled: isCanceled
				});
			}else{
				//console.log("■ " + result.rows[0].visitdate__c);
				result.rows.forEach(function(r){
					var dt = formatter.getJstDateFromSfdcDatetime(r.visitdate__c);
					r.datetime = formatter.formatDate(dt, "YYYY年 MM月 DD日(E) hh:mm");
				});
				res.render('ReservationList.ejs',
				{
					rows: result.rows
					,isCanceled: isCanceled
				});
			}
		}
	);
	done();
}

//キャンセル時
function cancel(req, res){
	var reservationId = req.body["reservationId"].trim();
	console.log("■ " + reservationId);
	pg.connect(process.env.DATABASE_URL, function(err, conn, done){
		conn.query(
			'UPDATE salesforce.Reservation__c SET Cancel__c = true WHERE sfid = $1',
			[reservationId],
			function(err, result){
				if(err){
					res.status(400).json({error: errStr});
				}else if(result.rowCount == 0){
					res.render('ReservationList.ejs',
					{
						rows: []
						,isCanceled: false
					});
				}else{
					getReservations(req, res, conn, done, true);
				}
			}
		);
		done();
	});
	pg.end();
}


module.exports = router;
