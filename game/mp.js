//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

var Games = null;
var Players = null;
var game = null;

function mp(game, socket){
	// this.startedAt = new Date();
	this.game = game;
	this.socket = socket;

	this.currentPlayer = null;

	for(var key in game.players)
		key.money = M_CONST.INITIAL_AMOUNT;
}

mp.prototype.getNextMove = function(){

}

function verify(socket){
	if(socket.hasOwnProperty('playerName')){
		if(Players.hasOwnProperty(socket.playerName))
			return Games.hasOwnProperty(Players[socket.playerName].getCurrentGame());
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






