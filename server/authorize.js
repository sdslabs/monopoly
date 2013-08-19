//Load Constants
var CONST = require('./constants.js');

//Runtime Variables
var games = {};	//Active Games
var gPlayers = {}; //Global Player List

// function newGame(){
// 	this.creator = null;
// 	this.createdAt = null;
// 	this.
// }

// function globalAuth(){
// 	for(var key in gPlayers){
// 		if(p.hasOwnProperty(key)) {

// 		}
// 	}
// }

//Protoypes of functions affecting gPlayers ===== START =====
function Player(){
	this.lastActivity = null;
	this.currentGame = null;
	this.sessionID = null;
}

Player.prototype.isAuth = function(socket){
	if(this.sessionID == socket.handshake.sessionID)
		return true;
	else
		return false;
}
//Protoypes of functions affecting gPlayers =====END==========


function initialize(io, express){
	games['game'] = {};
	games['game'].players = 0;

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
			socket.playerName = playerName;
		
			gPlayers[playerName] = new Player();
			gPlayers[playerName].lastActivity = new Date();
			gPlayers[playerName].currentGame = '';
			gPlayers[playerName].sessionID = socket.handshake.sessionID;

			socket.isAuth = true;
			socket.emit('addNewPlayerSuccess', playerName);
			console.log('[' + new Date()+ '] '+ socket.playerName + ' logged in.');

		});
		
	socket.on('createGame', function(game){
			socket.game = game;

			games[game] = {};
			games[game].players+=1;
			
			gPlayers[socket.playerName].currentGame = 'game';
			//gPlayers[playerName] = playerName;
			socket.join(game);
			socket.emit('addToGameSuccess', 'Connected to game: '+game);
			socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName);
			console.log('[' + new Date()+ '] '+ socket.playerName +' connected to game: ' + game);
		});

		socket.on('addToGame', function(game){
			if(games[game].players<CONST.G_MAX_PLAYERS_PER_GAME)
			{
				socket.game = game;
				games[game].players+=1;	
				socket.join(game);
				socket.emit('addToGameSuccess', 'Connected to game: '+game);
				socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName, games[game].players);
				console.log('[' + new Date()+ '] '+ 'Player ' + socket.playerName +' has connected to game: ' + game);
			}	
			else{	
				socket.emit('addToGameError', 'This game is full!!!');
				console.log('[' + new Date()+ '] '+ 'Player' + socket.playerName + ' refused access to '+ game + '.This game is full.');
			}
		});

		// socket.on('queryPlayerList', function(){
		// 	socket.emit('updateUserList', JSON.stringify(gPlayers));
		// });
		
		socket.on('exitFromGame', function(){
			games[socket.game].players -= 1;
			socket.leave(socket.game);
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
		});	
	});
}

module.exports.initialize = initialize;