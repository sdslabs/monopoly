//Global Objects containing current game and player info

var Players = {}; //Global Player List
var Games = {};	//Global game list

//Load the MySQL Driver
var db = require('./db.js');

//Load the Global Function Module
var global = require('./global.js');

const MIN_NAME_LEN = 4;


function doesGameExist(game){
	return Games.hasOwnProperty(game);
}
function doesPlayerExist(playerName){
	return Players.hasOwnProperty(playerName);
}

function verifyGame(game, socket) {
	if(Games[game].getTotalPlayers()<1){
		delete Games[game];
		socket.broadcast.emit('gameListChanged');
		global.log('info', 'Game: ' + game + ' has been destroyed');
		return false;
	}else
		return true;
}

module.exports.removePlayerFromGame = function (socket){
	if(doesPlayerExist(socket.playerName)){
		game = Players[socket.playerName].getCurrentGame();
		if(doesGameExist(game)){
			Games[game].removePlayer(socket.playerName);
			Players[socket.playerName].removeCurrentGame();
			db.removeGame(Players[socket.playerName].getSessionID());
			global.log('info', socket.playerName +' has left the game: ' + game);

			if(!verifyGame(game, socket))
				// socket.broadcast.to(game).emit('playerExited', socket.playerName);
				socket.broadcast.to(game).emit('playerListChanged');
			return true;
		}return false;
	}return false;
}

module.exports.removePlayerFromServer = function (socket) {
	if(doesPlayerExist(socket.playerName)){
		db.removeSession(Players[socket.playerName].getSessionID());
		removePlayerFromGame(socket);
        delete Players[socket.playerName];
        delete socket.playerName;
        socket.emit('logoutSuccess');
        socket.disconnect();
        return true;
    }else
    	return false;
}

module.exports.addPlayerToGame = function (game, socket){
	if(doesPlayerExist(socket.playerName)
		&&doesGameExist(game)) {
		socket.join(game);
		db.addGame(Players[socket.playerName].getSessionID(), game);
		Games[game].addPlayer(socket.playerName);
		Players[socket.playerName].setCurrentGame(game);
		socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName);
		socket.broadcast.emit('gameListChanged');
		socket.broadcast.to(game).emit('playerListChanged');
		global.log('info', socket.playerName +' connected to game: ' + game);
		return true;
	}return false;
}

module.exports.isValid = function (str) {
	if(str)
		return /^\w+$/.test(str) && str.length>=MIN_NAME_LEN; 
	return false;
}

module.exports.Players = Players;
module.exports.Games = Games;
module.exports.doesGameExist = doesGameExist;
module.exports.doesPlayerExist = doesPlayerExist;