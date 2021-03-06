//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

//Load the MySQL module
var mysql = require('mysql');

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
	synchronize();
	setInterval(synchronize, CONST.G_DB_SYNC_TIME);
}

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
			global.log('info', 'Synchronized tables in MySQL.');
		}
	});
}

module.exports.retrivePlayer = function (sessionID, callback){
	connection.query('SELECT player FROM sktio WHERE session = \"'+sessionID+'\"',
        function(err, row, fields){
        	// if(err){
        	// 	global.log('error', "retrivePlayer has failed. Resuming.")
        	// 	// throw err;
        	// }
        	// if(row[0]){
        	// 	if(row[0].hasOwnProperty('player'))
        	// 		callback(row[0].player);
        	// }else
        		callback('');
        });
return '';
}

module.exports.addPlayer = function (sessionID, playerName, callback){
	var Query = 'INSERT into sktio (session, player) VALUES '+'(\"'
				+sessionID+'\"'+', \"'+playerName+'\")';
	connection.query(Query,
		function(err, row, fields){
			// if(err){
   //      		global.log('error', "addPlayer has failed. Resuming.")
   //      		// throw err;
   //      	}	
			// if(callback)
			// 	callback();
		});
}

module.exports.retriveGame = function (sessionID, callback){
	connection.query('SELECT game FROM sktio WHERE session = \"'+sessionID+'\"',
        function(err, row, fields){
			if(err){
        		global.log('error', "retriveGame has failed. Resuming.")
        		// throw err;
        	}
        	if(row[0]){
        		if(row[0].hasOwnProperty('game'))
        			if(row[0].game!=null)
        				callback(row[0].game);
        			else
        				callback('');
        	}else
        		callback('');
        });
	return '';
}


module.exports.addGame = function (sessionID, game, callback){
	var Query = 'UPDATE sktio SET game = '+'\"'+game+'\" WHERE session = \"'+sessionID+'\"';
	connection.query(Query,
		function(err, row, fields){
			if(err){
        		global.log('error', "addGame has failed. Resuming.")
        		// throw err;
        	}	
			if(callback)
				callback();
		});
}

module.exports.removeGame = function (sessionID, callback){
	module.exports.addGame(sessionID, 'null', callback);
}

module.exports.removeSession = function (sessionID, callback){
	var Query = 'DELETE FROM sktio WHERE session = \"'+sessionID+'\"';
	connection.query(Query, 
		function(err, row, fields){
			if(err){
        		global.log('error', "removeSession has failed. Resuming.")
        		// throw err;
        	}
		});	
	
	var Query = 'DELETE FROM Sessions WHERE sid = \"'+sessionID+'\"';
	connection.query(Query, 
		function(err, row, fields){
			if(err){
        		global.log('error', "removeSession has failed. Resuming.")
        		// throw err;
        	}
			if(callback)
				callback();	
		});
}

module.exports.fetchLeaderboard = function(options, callback){
		options.start = parseInt(options.start) || 0;
		options.count = parseInt(options.end) || 0;
		
		if(!options.count)
			options.count = CONST.G_LDB_COUNT;
		
	var Query = "SELECT player as Name, Score FROM sktio ORDER BY Score desc LIMIT "+options.start +", "+options.count;
	connection.query(Query, 
		function(err, row, fields){
			if(err){
				global.log('error', "fetchLeaderboard has failed. Resuming.")
			}
			if(callback){
				var results = {
					results: row,
					time: new Date()
				};
				callback(results);
			}
		});
}

module.exports.updateScore = function(sessionID, Score, callback){
	var Query = 'UPDATE sktio SET score = '+Score+' WHERE sid = "'+sessionID+'"';

	connection.query(Query, 
		function(err, row, fields){
			if(err){
        		global.log('error', "updateScore has failed. Resuming.")
        		// throw err;
        	}
			if(callback)
				callback();	
		});
}

module.exports.connection = connection;
module.exports.connect = connect;
