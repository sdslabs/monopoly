//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

var Games = null;
var Players = null;
var game = null;

function mp(map, game, socket){
	// this.startedAt = new Date();
	this.game = game;
	this.socket = socket;
	this.map = Map;
	this.currentPlayer = 0;
}

mp.prototype.getNextPlayer = function(){
	var totalPlayers = this.game.getTotalPlayers;
	this.currentPlayer = (this.currentPlayer + 1) % totalPlayers;

	var i = 0;

	for (var j in this.game.getPlayers()){
		if(i == currentPlayer)
			return j;
		i++;
	} 
}

// Fetches a game associated with a socket.
function findGame(socket){
	if(socket.hasOwnProperty('playerName')){
		if(Players.hasOwnProperty(socket.playerName))
			return Games[Players[socket.playerName].getCurrentGame()];
	}else
		return null;
}

// Fetches a player associated with a socket.
function findPlayer(socket){
	if(socket.hasOwnProperty('playerName')){
		if(Players.hasOwnProperty(socket.playerName))
			return Players[socket.playerName];
	}else
		return null;
}



//This associates all dynamic functions associated with a map to the corrosponding socket object.
function init(G_ames, P_layers, socket){
	Games = G_ames;
	Players = P_layers; 

	socket.on('mpCurrentPlayers', function(){
		var players = findGame(socket).getPlayers();
		if(players){
			socket.emit('mpCurrentPlayers_cb', players);
			console.log(players);
		}
	});

	socket.on('mpInitialize', function(){
			var player = findPlayer(socket);
			player.money = M_CONST.INITIAL_AMOUNT;
			player.location.x = player.location.y = M_CONST.START_COORD;

	});

	socket.on('mpMove', function(moves, path){
		var game = findGame(socket);
		var flag = false;
		if(game){
			for(var i = 0; i<moves-1; i++)
				if(!game.map.properties[path[i]].paths.hasOwnProperty(path[i+1])){
					flag = true;
					break;
				}

			if(!flag){
				var nextPlayer = game.mp.getNextPlayer();

				socket.broadcast.to(game).emit('mpEnemyPath', path, nextPlayer);
				socket.emit("mpMoveAccepted", nextPlayer);
			}
			else
				socket.emit("mpMoveRejected");
		}
	});

	socket.on('PING2', function(){
		console.log('PING2 RECEIVED');
	});
}

module.exports.mp = mp;
module.exports.init = init;






