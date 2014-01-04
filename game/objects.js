//Load Constants
var CONST = require('../constants.js');

//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load the game module
var mp = require('./mp.js');

// function Player(socket){
// 	this.playerName = null;
// 	this.sessionID = null;
// 	this.lastActivity = null;
// 	this.currentGame = null;
// 	this.socket = socket;
// }

function Player(playerName, sessionID,
		currentGame, socket){
	// These can be modified anywhere. Corrosponding setters and getters are needed.
	this.playerName = playerName;
	this.sessionID = sessionID;
	this.lastActivity = new Date();
	this.currentGame = currentGame;
	this.socket = socket;

	// These are modified only in mp.js. No setters or getters needed.
	this.money = null;
	this.locProp = null;
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

// function Game(socket){
// 	this.creator = null;
// 	this.createdAt = null;
// 	this.lastActivity = null;
// 	this.players = {};
// 	this.totalPlayers = 0;
// 	this.socket = socket;
// 	this.map = map;
// 	this.mp = new mp.mp(game, socket);
// }

function Game(creator, game, socket){
	this.creator = creator;
	this.createdAt = new Date();
	this.lastActivity = this.createdAt;
	this.players = {};
	this.totalPlayers = 0;
	this.socket = socket;
	this.map = loadMap();
	this.mp = new mp.mp(game, socket);
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

function Location(){
	this.x = 0;
	this.y = 0;
}

Location.prototype.setX = function(x){
	this.x = x;
}

Location.prototype.setY = function(y){
	this.y = y;
}

Location.prototype.getX = function(){
	return this.x;
}

Location.prototype.getY = function(){
	return this.y;
}

// OBJECT DESCRIPTION 

// function Property(){
// 	this. id = null;
// 	this.name = null;
// 	this.owner = null;
// 	this.type = null;
// 	this.maxLevel = null;
// 	this.basePrice = 0;
// 	this.location = new Location();
//  this.path = null;
// }

// function Map(){
// 	this.properties = properties;
 // }

// loadMap creates a new copy of the map for each game and adds functions to it

function loadMap(){
	var map = require('./map.json');

	map.doesPropExist = function(property){	
		return map.properties.hasOwnProperty(property);
	}

	map.doesPathExist = function(prop1, prop2){
		if(map.doesPropExist(prop1))
			if(map.properties[prop1].paths.indexOf("" + prop2) != -1)
				return true;
		return false;
	}

	return map;
}

module.exports.Game = Game;
module.exports.Player = Player;
module.exports.init = mp.init;