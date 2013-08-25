//Load Constants
var CONST = require('./constants.js');

var SessionStore = null;

function connect(express, app){
	var connectMySQLSession = require('connect-mysql-session')(express);
	SessionStore = new connectMySQLSession(
			CONST.G_MYSQL_DB,
			CONST.G_MYSQL_USERNAME,
			CONST.G_MYSQL_PASSWORD,
			{
				logging: CONST.G_LOG_CONNECTION_MESSAGES
			})

	app.use(express.cookieParser());
	app.use(express.session({
		store: SessionStore,
		secret: CONST.G_EXPRESS_SESSION_SECRET
	}));
	module.exports.SessionStore = SessionStore;
}

var mysql = require('mysql');

var connection = mysql.createConnection({
	host:      CONST.G_MYSQL_HOST,
	user:      CONST.G_MYSQL_USERNAME,
	password : CONST.G_MYSQL_PASSWORD,
	database : CONST.G_MYSQL_DB
});

connection.connect();

module.exports.connection = connection;
module.exports.connect = connect;
