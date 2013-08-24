function Player(){
	this.playerName = null;
	this.sessionID = null;
	this.lastActivity = null;
	this.currentGame = null;
	this.sessionID = null;
}

function Game(){
	this.creator = null;
	this.createdAt = null;
	this.players = {};
	this.totalPlayers = 0;
}

module.exports.Game = Game;
module.exports.Player = Player