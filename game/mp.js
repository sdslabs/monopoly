//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load Map
var map = require('./map.js');

function Mp(game, socket){
	this.map = new map.Map();
	this.startedAt = new Date();

	this.currentPlayer = null;

	for(var key in game.players)
		key.money = M_CONST.INITIAL_AMOUNT;

	socket.on('PING', function(){
		console.log(game.totalPlayers);
	});

}

module.exports.Mp = Mp;






