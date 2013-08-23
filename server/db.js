//Load Constants
var CONST = require('./constants.js');

function connect(express, app){
	var SessionStore = require('connect-mysql-session')(express);

	app.use(express.cookieParser());
	app.use(express.session({
		store: new SessionStore(
			CONST.G_MYSQL_DB,
			CONST.G_MYSQL_USERNAME,
			CONST.G_MYSQL_PASSWORD,
			{
				logging: CONST.G_LOG_REQUESTS
			}),
		secret: CONST.G_EXPRESS_SESSION_SECRET
	}));
}

var mysql = require('mysql');

var conn = mysql.createConnection({
	host:      CONST.G_MYSQL_HOST,
	user:      CONST.G_MYSQL_USERNAME,
	password : CONST.G_MYSQL_PASSWORD,
	database : CONST.G_MYSQL_DB
});

conn.connect();

module.exports.connect= connect;
module.exports.conn = conn;