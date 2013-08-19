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

module.exports.connect= connect;