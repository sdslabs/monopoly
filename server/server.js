//Load Constants
var CONST = require('./constants.js');


var express = require('express');
var http = require('http')
var app = express();
var MySQLSessionStore = require('connect-mysql-session')(express, {log:false});

//Initialize Server 
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: CONST.G_LOG_REQUESTS});
server.listen(CONST.G_SERVER_PORT);

//Load authorization file
var authorize = require('./authorize.js');

app.use(express.cookieParser());
app.use(express.session({
	store: new MySQLSessionStore(
		CONST.G_MYSQL_DB,
		CONST.G_MYSQL_USERNAME,
		CONST.G_MYSQL_PASSWORD,
		{
			logging: false//CONST.G_LOG_REQUESTS
		}),
	secret: CONST.G_EXPRESS_SESSION_SECRET
}));

//Initialize Router
var router = require('./router.js');
router.initialize(app);

//Initialize Authorization Socket Responses
authorize.initialize(io, express);

