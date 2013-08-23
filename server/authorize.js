//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

//Load the game module
var objects = require('./objects.js');

//Load the MySQL Driver
var mysql = require('mysql');

var db = mysql.createConnection({
	host:      CONST.G_MYSQL_HOST,
	user:      CONST.G_MYSQL_USERNAME,
	password : CONST.G_MYSQL_PASSWORD,
	database : CONST.G_MYSQL_DB
});

db.connect();

//Global Objects containing current game and player info
var Games = {};	//Active Games
var Players = {}; //Global Player List


function doesGameExist(game){
	return Games.hasOwnProperty(game);
}

function doesPlayerExist(playerName){
	return Players.hasOwnProperty(playerName);
}

function getGameList(){
	return Games;
}

function getPlayerList(){
	return Players;
}


function initialize(io, express){
	Games['game'] = new objects.Game();
	Games['game'].totalPlayers = 0;

	//Authenication Needed
	io.set('authorization', function (data, accept) {
   		// check if there's a cookie header
    	if (data.headers.cookie) {
        	// if there is, parse the cookie
        	data.cookie = express.utils.parseCookie(data.headers.cookie);
        	// retrive the cookie
        	data.sessionID = data.cookie['connect.sid'];
        	console.log(data.sessionID);
        	// db.query('SELECT player FROM sktio WHERE session = \''+data.sessionID+'\'',
        	// 	function(err, row, fields){
        	// 		if(err)
        	// 			throw err;
        	// 		if(row[0])
        	// 			if(row[0].hasOwnProperty('player'))
        	// 		 		data.playerName = row[0].player;
        	// 	});
    	} else {
       	// if there isn't, turn down the connection with a message
       	// and leave the function.
       	return accept('No cookie transmitted.', false);
    	}
    	// accept the incoming connection
    	accept(null, true);
	});

	io.sockets.on('connection', function (socket){

		socket.on('addNewPlayer', function(playerName){
			if(!doesPlayerExist(playerName)&&playerName.replace(/\s/g, '')!=''&&!socket.hasOwnProperty('playerName')){

				var Query = 'INSERT into sktio (session, player) VALUES '+'(\"'
					+socket.handshake.sessionID+'\"'+', \"'+playerName+'\")';
				db.query(Query,
					function(err, row, fields){
						if(err)
							throw err;

					});

				socket.playerName = playerName;
				Players[playerName] = new objects.Player();
				Players[playerName].playerName = playerName;
				Players[playerName].lastActivity = new Date();
				Players[playerName].sessionID = socket.handshake.sessionID;

				socket.emit('addNewPlayerSuccess');
				global.log('info', 'Player: ' + socket.playerName + ' logged in.');
			}
			else{
				socket.emit('addNewPlayerFailed', playerName + 'already exists or illegal name');
				global.log('warn', playerName + ' was refused connection. Already exists.');
			}
		});
		
		socket.on('createGame', function(game){

			if(!doesGameExist(game)&&doesPlayerExist(socket.playerName&&Players[socket.currentGame]==null)){
				Games[game] = new objects.Game();
				Games[game].players[socket.playerName] = Players[socket.playerName];
				Games[game].totalPlayers++;
				
				Players[socket.playerName].currentGame = game;
				socket.join(game);

				socket.emit('addToGameSuccess', 'Connected to game: '+game);
				socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName);
				global.log('info', socket.playerName +' connected to game: ' + game);
			}
			else{
				socket.emit('addToGameError', 'Not authorized to create game');
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to create game: ' + game);
			}
		});

		socket.on('addToGame', function(game){
			if(doesGameExist(game)&&doesPlayerExist(socket.playerName)&&Players[socket.currentGame]==null){
				if(Games[game].totalPlayers<CONST.G_MAX_PLAYERS_PER_GAME)
				{
					socket.join(game);

					Players[socket.playerName].currentGame = game;
					Games[game].totalPlayers++;	
					Games[game].players[socket.playerName] = Players[socket.PlayerName];
					
					socket.emit('addToGameSuccess', 'Connected to game: '+game);
					socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName, Games[game].players);
					global.log('info', 'Player ' + socket.playerName +' has connected to game: ' + game);
				}	
				else{	
					socket.emit('addToGameError', 'This game is full!!!');
					global.log('warn', 'Player ' + socket.playerName + ' refused access to '+ game + '.This game is full.');
				}
			}
			else{
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to join game: '+game);
			}
		});

	 	socket.on('queryPlayerList', function(){
		 	if(doesPlayerExist(socket.playerName)){
		 		playerList = {};
		 		for(var key in Players)
		 			if(doesPlayerExist(key))
		 				playerList[key] = '';
		 		socket.emit('updatePlayerList', JSON.stringify(playerList));
		 		global.log('info', 'Player list sent to player: ' + socket.playerName);
		 	}
		 	else{
		 		global.log('warn', 'Player list not sent to:' + socket.playerName)
		 	}
		});

		socket.on('queryGameList', function(){
			if(doesPlayerExist(socket.playerName)){
				gameList = {};
		 		for(var key in Games)
		 			if(doesGameExist(key))
		 				gameList[key] = '';
				socket.emit('updateGameList', JSON.stringify(gameList));
				global.log('info', 'Game list sent to player: ' + socket.playerName);
			}
			else{
		 		global.log('warn', 'Game list not sent to:' + socket.playerName)
		 	}
		});
		
		socket.on('exitFromGame', function(){
			game = Players[socket.playerName].currentGame;
			if(doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				socket.leave(game);

				Games[game].totalPlayers--;
				delete Games[game].players[socket.playerName];

				Players[socket.playerName].currentGame = null;
				
				global.log('info', socket.playerName +' has left the game: ' + socket.game);
					
				if(Games['game'].totalPlayers<1){
					delete Games[game];
					global.log('info', 'Game: ' + game + ' has been destroyed');
				}
				else{	
					socket.broadcast.to(game).emit('playerExited', socket.playerName);
					socket.emit('exitFromGameSuccess', 'socket.game');
					global.log('info', 'Player' + socket.playerName + ' has left the game');
				}
			}
			else{
				global.log('warn', 'Illegal request to exit game from player: '+ socket.playerName);
			}
		});	
	});
}

module.exports.initialize = initialize;
module.exports.getGameList = getGameList;
module.exports.getPlayerList = getPlayerList;