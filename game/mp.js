//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load Map
var map = require('./map.js');

var Games = null;
var Players = null;

function MP(game, socket){
	this.map = new map.Map();
	this.startedAt = new Date();
	this.game = game;
	this.socket = socket;

	this.currentPlayer = null;

	for(var key in game.players)
		key.money = M_CONST.INITIAL_AMOUNT;
}

MP.prototype.begin = function(){
	var i = ~~(Math.rand()%this.game.totalPlayers), j = 0;
	for(var key in this.game.players)
		if(j++ == i){
			this.currentPlayer = key;
			break;
		}
}

MP.prototype.getCurrentPlayer = function(){
	return this.currentPlayer;
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
		game = findGame(socket);
		socket.emit('ret_currentPlayer', game.MP.get)
	})
}

module.exports.MP = MP;
module.exports.init = init;






