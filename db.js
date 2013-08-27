//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

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

function synchronize(){
	var sid = {};
	var Query ="SELECT sktio.id FROM sktio, Sessions where sktio.session=Sessions.sid";
	connection.query(Query, function(err, rows, fields){
		if(err)
			global.log('error', 'Failed to synchronize tables in MySql');;

		if(rows[0]!=null){
			Query = "DELETE FROM sktio WHERE NOT (id = \'"+rows[0].id+'\'';
			for(var i = 1; rows[i]!=null; i++){			
				Query+=(" OR id = \'"+rows[i].id+'\'');
			}
		 	Query += ')';
		
			connection.query(Query, function(err, rows, fields){
				if(err)
					throw err;				
				});
			global.log('info', 'Synchronized tables in MySQL. Next synchronization in 30 mins');
		}
	});
}

setTimeout(synchronize(), 1800000);

module.exports.synchronize = synchronize;
module.exports.connection = connection;
module.exports.connect = connect;
