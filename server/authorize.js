//Load Constants
var CONST = require('./constants.js');

//Runtime Variables
var games = {};	//Active Games
var Players = {}; //Global Player List

function Game(){
	this.creator = null;
	this.createdAt = null;
	this.players = {};
	this.totalPlayers = 0;
}

function doesGameExist(game){
	return game.hasOwnProperty(game);
}

//Protoypes of functions affecting Players ===== START =====
function Player(){
	this.playerName = null;
	this.lastActivity = null;
	this.currentGame = null;
	this.sessionID = null;
}

function doesPlayerExist(playerName){
	return Players.hasOwnProperty(playerName);
}

// Player.prototype.isAuth = function(socket){
// 	if(this.sessionID == socket.handshake.sessionID)
// 		return true;
// 	else
// 		return false;
// }
//Protoypes of functions affecting Players =====END==========


function initialize(io, express){
	games['game'] = {};
	games['game'].totalPlayers = 0;

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
				console.log('[' + new Date()+ '] '+ 'Player: ' + socket.playerName + ' logged in.');
			}
			else
				socket.emit('addNewPlayerFailed', playerName + 'already exists or illegal name');
		});
		
		socket.on('createGame', function(game){

			if(!doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				games[game] = new Game();
				games[game].totalPlayers++;
				
				Players[socket.playerName].currentGame = game;
				socket.join(game);

				socket.emit('addToGameSuccess', 'Connected to game: '+game);
				socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName);
				console.log('[' + new Date()+ '] '+ socket.playerName +' connected to game: ' + game);
			}
			else{
				socket.emit('addToGameError', game + 'already exists');
				console.log('[' + new Date()+ '] '+ 'Player ' + socket.playerName + ' not allowed to create game: ' + game);
			}
		});

		socket.on('addToGame', function(game){
		//	if(doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				if(doesPlayerExist(socket.playerName)){
				if(games[game].totalPlayers<CONST.G_MAX_PLAYERS_PER_GAME)
				{
					socket.join(game);

					Players[socket.playerName].currentGame = game;
					games[game].totalPlayers++;	
					
					socket.emit('addToGameSuccess', 'Connected to game: '+game);
					socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName, games[game].players);
					console.log('[' + new Date()+ '] '+ 'Player ' + socket.playerName +' has connected to game: ' + game);
				}	
				else{	
					socket.emit('addToGameError', 'This game is full!!!');
					console.log('[' + new Date()+ '] '+ 'Player ' + socket.playerName + ' refused access to '+ game + '.This game is full.');
				}
			}
			else{
				console.log('[' + new Date()+ '] '+ 'Player ' + socket.playerName + ' not allowed to join game: '+game);
			}
		});

		// socket.on('queryPlayerList', function(){
		// 	socket.emit('updateUserList', JSON.stringify(Players));
		// });
		
		socket.on('exitFromGame', function(){
			if(doesGameExist(game)&&doesPlayerExist(socket.playerName)){
				socket.leave(socket.game);
				games[socket.game].totalPlayers--;
				Players[socket.planerName].currentGame = null;
				
				console.log('[' + new Date()+ '] '+ socket.playerName +' has left the game: ' + socket.game);
					
				if(games['game'].players<1){
					delete games[socket.game];
					console.log('[' + new Date()+ '] '+ 'Game: ' + game + 'has been destroyed');
				}
				else{	
					socket.broadcast.to(socket.game).emit('playerExited', socket.playerName);
					socket.emit('exitFromGameSuccess', 'socket.game');
					socket.game = "";
				}
			}
		});	
	});
}

module.exports.initialize = initialize;