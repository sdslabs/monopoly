//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

//Global Objects containing current game and player info
var Games = {};	//Active Games
var Players = {}; //Global Player List


function Game(){
	this.creator = null;
	this.createdAt = null;
	this.players = {};
	this.totalPlayers = 0;
}

function doesGameExist(game){
	return Games.hasOwnProperty(game);
}

function Player(){
	this.playerName = null;
	this.lastActivity = null;
	this.currentGame = null;
	this.sessionID = null;
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
	Games['game'] = new Game();
	Games['game'].totalPlayers = 0;

	//Authenication Needed
	io.set('authorization', function (data, accept) {
   		// check if there's a cookie header
    	if (data.headers.cookie) {
        	// if there is, parse the cookie
        	data.cookie = express.cookieParser(data.headers.cookie);
        	// retrive the cookie
        	data.sessionID = data.cookie['connect.sid'];
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
			if(!doesPlayerExist(playerName)&&playerName!=null){
				socket.playerName = playerName;
			
				Players[playerName] = new Player();
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

			if(!doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				Games[game] = new Game();
				Games[game].players[socket.playerName] = '';
				Games[game].totalPlayers++;
				
				Players[socket.playerName].currentGame = game;
				socket.join(game);

				socket.emit('addToGameSuccess', 'Connected to game: '+game);
				socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName);
				global.log('info', socket.playerName +' connected to game: ' + game);
			}
			else{
				socket.emit('addToGameError', game + 'already exists');
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to create game: ' + game);
			}
		});

		socket.on('addToGame', function(game){
			if(doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				if(Games[game].totalPlayers<CONST.G_MAX_PLAYERS_PER_GAME)
				{
					socket.join(game);

					Players[socket.playerName].currentGame = game;
					Games[game].totalPlayers++;	
					Games[game].players[socket.playerName] = '';
					
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
		 	playerList = {};
		 	for(var key in Players)
		 		if(doesPlayerExist(key))
		 			playerList[key] = '';
		 	socket.emit('updatePlayerList', JSON.stringify(playerList));
		 	global.log('info', 'Player list sent to player: ' + socket.playerName);
		});

		socket.on('queryGameList', function(){
			f(doesPlayerExist(socket.playerName){
				gameList = {};
		 		for(var key in Games)
		 			if(doesGameExist(key))
		 				gameList[key] = '';
				socket.emit('updateGameList', JSON.stringify(gameList));
				global.log('info', 'Game list sent to player: ' + socket.playerName);
			}
		});
		
		socket.on('exitFromGame', function(){
			if(doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				socket.leave(socket.game);

				Games[socket.game].totalPlayers--;
				delete Games[game].players[socket.playerName];

				Players[socket.planerName].currentGame = null;
				
				global.log('info', socket.playerName +' has left the game: ' + socket.game);
					
				if(Games['game'].totalPlayers<1){
					delete Games[socket.game];
					global.log('info', 'Game: ' + game + 'has been destroyed');
				}
				else{	
					socket.broadcast.to(socket.game).emit('playerExited', socket.playerName);
					socket.emit('exitFromGameSuccess', 'socket.game');
					socket.game = "";
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