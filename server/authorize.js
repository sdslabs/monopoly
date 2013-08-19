//Load Constants
var CONST = require('./constants.js');

//Runtime Variables
var games = {};	//Active Games
var gplayers = {}; //Global Player List

function initialize(io, express){
	games['game'] = {};
	games['game'].players = 0;

	//Authenication Needed

	io.set('authorization', function (data, accept) {
   		// check if there's a cookie header
 
    	if (data.headers.cookie) {
        	// if there is, parse the cookie
        	data.cookie = express.cookieParser(data.headers.cookie);
        	// retri
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

		socket.on('addNewPlayer', function(userName){
			socket.userName = userName;
		
			gplayers[userName] = {};
			gplayers[userName].lastActivity = new Date();
			gplayers[userName].currentGame = '';
			gplayers[userName].isAuth = true;

			socket.emit('addNewPlayerSuccess', userName);
		});

		socket.on('createGame', function(game){
			if(gplayers[socket.userName].isAuth == false){
				socket.emit('createGameError', 'Unauthorized access');
				console.log('Illegal request to create '+ game + ' by '+socket.userName);
			}
			else
			{
				socket.game = game;

				games[game] = {};
				games[game].players+=1;
				
				gplayers[socket.userName].currentGame = 'game';
				
				//gplayers[userName] = userName;
				socket.join(game);
				socket.emit('addToGameSuccess', 'Connected to game: '+game);
				socket.broadcast.to(game).emit('newPlayerAdded', socket.userName);
				console.log('New player ' + socket.userName +' has connected to game: ' + game);
			}
		});

		socket.on('addToGame', function(game){
			if(gplayers[socket.userName].isAuth == false){
				socket.emit('createGameError', 'Unauthorized access');
			console.log('Illegal request to create '+ game + ' by '+socket.userName);
			}
			else if(games[game].players<CONST.G_MAX_PLAYERS_PER_GAME)
			{
				socket.game = game;
				games[game].players+=1;	
				socket.join(game);
				socket.emit('addToGameSuccess', 'Connected to game: '+game);
				socket.broadcast.to(game).emit('newPlayerAdded', socket.userName, games[game].players);
				console.log('New player ' + socket.userName +' has connected to game: ' + game);
			}	
			else{	
				socket.emit('addToGameError', 'This game is full!!!');
				console.log(games[game] + ' '+ games[game].players);
			}
		});

		socket.on('queryPlayerList', function(){
			if(gplayers[socket.userName].isAuth == false){
				socket.emit('createGameError', 'Unauthorized access');
				console.log('Illegal request to create '+ game + ' by '+socket.userName);
			}
			else
				socket.emit('updateUserList', JSON.stringify(gplayers));
		});
		
		socket.on('exitFromGame', function(){
			if(gplayers[socket.userName].isAuth == false){
				socket.emit('createGameError', 'Unauthorized access');
				console.log('Illegal request to create '+ game + ' by '+socket.userName);
			}
			else{
				games[socket.game].players -= 1;
				socket.leave(socket.game);
				console.log(socket.userName +' has left the game: ' + socket.game);
				
				if(games['game'].players<1)
				{
					delete games[socket.game];
					console.log('Game: ' + game + 'has been destroyed');
				}
				else{	
					socket.broadcast.to(socket.game).emit('playerExited', socket.userName);
					socket.emit('exitFromGameSuccess', 'socket.game');
					socket.game = "";
				}
			}
		});	
	});
}

module.exports.initialize = initialize;