//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load Map
var map = require('./map.js');

var Games = null;
var Players = null;
var game = null;

function mp(game, socket){
	this.map = new map.Map();
	this.startedAt = new Date();
	this.game = game;
	this.socket = socket;

	this.currentPlayer = null;

	for(var key in game.players)
		key.money = M_CONST.INITIAL_AMOUNT;
}

mp.prototype.begin = function(){
	var i = ~~(Math.rand()%this.game.totalPlayers), j = 0;
	for(var key in this.game.players)
		if(j++ == i){
			this.currentPlayer = key;
			break;
		}
}

mp.prototype.getCurrentPlayer = function(){
	return this.currentPlayer;
}

mp.prototype.getNextMove = function(){

}

function verify(game, playerName){
	return Games.hasOwnProperty(game) && socket.hasOwnProperty(playerName);
}

function findGame(socket){
	return Games[Players[socket.PlayerName].getCurrentGame()];
}

function init(G_ames, P_layers, socket){
	Games = G_ames;
	Players = P_layers; 

	socket.on('getCurrentPlayer', function(){
		socket.emit('ret_currentPlayer', findGame(socket).mp.getCurrentPlayer());
	});

	socket.on('getNextMove', function(){
		socket.emit('ret_NextMove', findGame(socket).mp.getNextMove());
	});

	socket.on('')

	// socket.on('getPropertyInfo', function(propertyID){
	// 	socket.emit('ret_PropertyInfo', findGame(socket).Map.getPropertyInfo());
	// });

	// socket.on('applyMove', function(){
	// 	socket.emit
	// });
}

module.exports.mp = mp;
module.exports.init = init;






