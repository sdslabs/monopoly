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

// mp.prototype.begin = function(){
// 	var i = ~~(Math.rand()%this.game.totalPlayers), j = 0;
// 	for(var key in this.game.players)
// 		if(j++ == i){
// 			this.currentPlayer = key;
// 			break;
// 		}
// }

// mp.prototype.getCurrentPlayer = function(){
// 	return this.currentPlayer;
// }

mp.prototype.getNextMove = function(){

}

function verify(socket){
	if(socket.hasOwnProperty('playerName')){
		if(Players.hasOwnProperty(socket.playerName))
			return Games.hasOwnProperty(Players[socket.playerName].getCurrentGame());
			//console.log(Games);
	}else
		return false;
}

function findGame(socket){
	if(verify(socket))
		return Games[Players[socket.playerName].getCurrentGame()];
	else
		return null;
}

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

	socket.on('getNextMove', function(){
		socket.emit('ret_NextMove', findGame(socket).mp.getNextMove());
	});


	socket.on('PING2', function(){
		console.log('PING2 RECEIVED');
	});
}

module.exports.mp = mp;
module.exports.init = init;






