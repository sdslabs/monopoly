//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load the Global Function Module
var global = require('../global.js');

var Games = null;
var Players = null;
var game = null;

function mp(game, socket){
	// this.startedAt = new Date();
	this.game = game;
	this.socket = socket;
	this.currentPlayer = null;
}

mp.prototype.getNextPlayer = function(){
	var players = findGame(this.socket).getPlayers();
	this.currentPlayer = players[(players.indexOf(this.currentPlayer)+1)%players.length];
	return this.currentPlayer;
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

//This associates all dynamic functions associated with a gane object to the corrosponding socket object.
function init(G_ames, P_layers, socket){
	Games = G_ames;
	Players = P_layers; 

	socket.on('mpCurrentPlayers', function(){
		var game = findGame(socket)
		if(game){
			var players = game.getPlayers();
			if(players){
				socket.emit('mpCurrentPlayersSuccess', players);
				console.log(players);
			}
		}
	});

	socket.on('mpInitialize', function(){
			var player = findPlayer(socket);
			player.money = M_CONST.INITIAL_AMOUNT;
			player.locProp = M_CONST.START_PROP;
			console.log(Players);
			socket.emit("mpInitSuccess");
			socket.emitR("mpInitBy", player.playerName);

	});

	socket.on('mpMove', function(route){
		var moves = route.length;
		var game = findGame(socket);
		var player = findPlayer(socket);
		var flag = false;

		if(game){
			if(moves <= 6){
				var i = 0;
				if(player.locProp == M_CONST.START_PROP){
					player.locProp = M_CONST.FIRST_PROP;
					i++;
				}

				for(; i<moves; i++){
					if(!game.map.doesPathExist(player.locProp, route[i])){
						global.log('warn', "Illegal move by " + socket.playerName + " in game " + player.getCurrentGame() + ". No path between " + player.locProp + ", " + route[i]);
						flag = true;
						break;
					}
					player.locProp = route[i];
				}
			}else
				flag = true;
				
			if(!flag){
				var nextPlayer = game.mp.getNextPlayer();
				socket.emitR('mpPlayerMove', route, nextPlayer);
				socket.emit("mpMoveSuccess", nextPlayer);
				global.log('verbose', "Move by " + socket.playerName + " in game " + player.getCurrentGame() + ". Route " + route + ".");
			}
			else{
				socket.emit("mpMoveRejected");
			}
		}
	});

	socket.on("mpBuy", function(property){
		var player = findPlayer(socket);
		var game = findGame(socket);

		if(game.mp.currentPlayer.equals(player.playerName))
			if(game.map.properties.hasOwnProperty(property))
				if(game.map.properties[property].owner.equals(M_CONST.NO_OWNER))
					if(player.money > game.map.properties[property].value){
						player.money -= game.map.properties[property].value;
						game.map.properties[property].owner = player.playerName;
						player.propOwned.push(property);
						socket.emit("mpBuySuccess");
						socket.emitR("mpBuyBy", player.playerName, property);
					}
	});

	socket.on('PING2', function(garb1, garb2){
		
		console.log('PING2 RECEIVED');
		console.log(findGame(socket).mp.getNextPlayer());
	});
}

module.exports.mp = mp;
module.exports.init = init;






