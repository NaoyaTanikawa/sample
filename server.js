const Iconv = require('iconv').Iconv;
const iconv = new Iconv('SHIFT_JIS','UTF-8');

var str = 'お試しcode\n';
var http = require("http");
const PORT = process.env.PORT || 3001;
http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end(str);
}).listen(PORT);

console.log('Server is runnning at http://localhost:' + PORT + '/');

//process.exit();
