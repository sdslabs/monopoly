//Load Constants
var CONST = require('../constants.js');

//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load the game module
var MP = require('./mp.js');

function Player(socket){
	this.playerName = null;
	this.sessionID = null;
	this.lastActivity = null;
	this.currentGame = null;
	this.socket = socket;

}

function Player(playerName, sessionID,
		currentGame, socket){
	this.playerName = playerName;
	this.sessionID = sessionID;
	this.lastActivity = new Date();
	this.currentGame = currentGame;
	this.socket = socket;
}

Player.prototype.getPlayerName = function(){
	return this.playerName;
}

Player.prototype.getSessionID = function(){
	return this.sessionID;
}

Player.prototype.getlastActivity = function(){
	return this.lastActivity;
}

Player.prototype.getCurrentGame = function(){
	return this.currentGame;
}

Player.prototype.setPlayerName = function(playerName){
	this.playerName = playerName;
	lastActivity = new Date();
}

Player.prototype.setSessionID = function(sessionID){
	this.sessionID = sessionID;
	lastActivity = new Date();
}

Player.prototype.setCurrentGame = function(currentGame){
	this.currentGame = currentGame;
	lastActivity = new Date();
}

function Game(socket){
	this.creator = null;
	this.createdAt = null;
	this.lastActivity = null;
	this.players = {};
	this.totalPlayers = 0;
	this.socket = socket;
	this.MP = new MP.MP(this, socket);
}

function Game(creator, socket){
	this.creator = creator;
	this.createdAt = new Date();
	this.lastActivity = this.createdAt;
	this.players = {};
	this.totalPlayers = 0;
	this.socket = socket;
	this.mp = new MP.MP(this, socket);


}

Game.prototype.getCreator = function(){
	return this.creator;
}

Game.prototype.getcreatedAt = function(){
	return this.createdAt;
}

Game.prototype.getlastActivity = function(){
	return this.lastActivity;
}

Game.prototype.getPlayers = function(){
	return this.players;
}

Game.prototype.getTotalPlayers = function(){
	return this.totalPlayers;
}

Game.prototype.setCreator = function(creator){
	this.creator = creator;
	this.lastActivity = new Date();
}

Game.prototype.setcreatedAt = function(createdAt){
	this.createdAt = createdAt;
	this.lastActivity = new Date();
}

Game.prototype.addPlayer = function(playerName){
	this.players[playerName] = '';
	this.lastActivity = new Date();
	this.totalPlayers++;
}

Game.prototype.removePlayer = function(playerName){
	if(this.players.hasOwnProperty(playerName)){
		delete this.players[playerName];
		this.totalPlayers--;
		this.lastActivity = new Date();
	}
}

Game.prototype.morePlayersAllowed = function(){
	return this.totalPlayers <= M_CONST.MAX_PLAYERS_PER_GAME;
}

module.exports.Game = Game;
module.exports.Player = Player;
module.exports.init = MP.init;