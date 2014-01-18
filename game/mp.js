//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load the Global Function Module
var global = require('../global.js');

// Load the authorization module
var auth = require('../auth-main.js');
var places = require('./places.js');

var Games = null;
var Players = null;
var game = null;

function mp(game, socket){
	// this.startedAt = new Date();
	this.game = game;
	this.started = false;
	this.socket = socket;
	this.turnsPlayed = 0;
	this.currentPlayer = null;
}

// mp.socket stores the creator's socket

mp.prototype.getNextPlayer = function(){

	if(this.started){
		var players = findGame(this.socket).getPlayers();
		if(this.currentPlayer)
			this.currentPlayer = players[(players.indexOf(this.currentPlayer)+1)%players.length];
		else
			this.currentPlayer = players[0];
		global.log('verbose', "Player: " + currentPlayer + "'s' turn is next.")
		return this.currentPlayer;
	}
	return null;
}

mp.prototype.levyTax = function(socket){
	var player =  findPlayer(socket);
	var prop = player.locProp;
	
	if(this.game.map.properties[prop].owner != M_CONST.NO_OWNER &&
		this.game.map.properties[prop].owner != player.playerName){
		player.money -= this.game.map.properties[prop].value*M_CONST.TAX_FROM_PLAYER;
		Players[this.game.map.properties[prop].owner].money += this.game.map.properties[prop].value*M_CONST.TAX_TO_OWNER;
		socket.emit("mpTaxLevied");
		socket.emitR("mpTaxLevied", player.playerName);
	}
}

mp.prototype.provideMoney = function(){
	var players = findGame(this.socket).getPlayers();
	for(var i = 0; i < players.length; i++)
		Players[players[i]].money += M_CONST.MONEY_PER_UPDATE;
	global.log('verbose', "Provided money ("+M_CONST.MONEY_PER_UPDATE+") to everyone in "+this.game.id);
}

mp.prototype.end = function(){
	var results = [];
	var players = this.game.getPlayers();
	for(var i = 0; i < players.length; i++)
		results.push([Players[players[i]].playerName, Players[players[i]].money]);
	results.sort(function(a, b){
		return a[1] - b[1];
	});

	var report = {};
	report.results = results;
	report.startAt = this.game.createdAt;
	report.endAt = new Date();

	for(var i = 0; i < players.length; i++)
		auth.removePlayerFromGameSp(Players[players[i]].socket);

	var id = this.game.id;
	delete Games[id];

	this.game.socket.broadcast.to(id).emit('endGame', report);
	this.game.socket.emit('endGame', report);

	global.log('info', 'Game: '+ id + 'has ended.')
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

	socket.on('beginGame', function(){
		var game = findGame(socket);
		if(game&&!game.mp.started)
		if(game.creator == socket.playerName && !game.mp.started){
			game.mp.started = true;
			socket.broadcast.to(findGame(socket).id).emit('beginGame');
			global.log('info', 'Game '+game.id+' has started.');
			// socket.emitR('beginGame');
		}
	})

	
	socket.on('mpCurrentPlayers', function(){
		var game = findGame(socket);
		if(game&&game.mp.started){
			var players = game.getPlayers();
			if(players){
				socket.emit('mpCurrentPlayersSuccess', players);
				console.log(players);
			}
		}
	});

	socket.on('mpInitialize', function(){
		var game = findGame(socket);
		if(game&&game.mp.started){	
			var player = findPlayer(socket);
			player.money = M_CONST.INITIAL_AMOUNT;
			player.locProp = M_CONST.START_PROP;
			socket.emit("mpInitSuccess");
			socket.broadcast.to(game.id).emit("mpInitBy", player.playerName);
		}else{
			global.log('warn', 'Game could not be found');
		}

	});

	socket.on('mpMove', function(route){
		var moves = route.length;
		var game = findGame(socket);
		var player = findPlayer(socket);
		var flag = false;
		console.log(game);
		if(game&game.mp.started){
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
			
			console.log('2')
			if(!flag){
				game.mp.turnsPlayed++;
				if(game.mp.turnsPlayed > M_CONST.END_GAME_LIM)
					game.mp.end();
				if(!(game.mp.turnsPlayed % M_CONST.MONEY_RFRSH_LIM))
					game.mp.provideMoney();
				game.mp.levyTax(socket);
				var nextPlayer = game.mp.getNextPlayer();
				socket.emit("mpMoveSuccess", nextPlayer);
				socket.broadcast.to(game.id).emit('mpMoveOther', route, nextPlayer);
				global.log('verbose', "Move by " + socket.playerName + " in game " + player.getCurrentGame() + ". Route " + route + ".");
			}
			else{
				socket.emit("mpMoveFail");
			}
		}
	});

	socket.on("mpBuy", function(){
		var player = findPlayer(socket);
		var game = findGame(socket);
		var property = player.locProp;

		if(game&game.mp.started){
			if((game.mp.currentPlayer == player.playerName)
			&&(game.map.properties.hasOwnProperty(property) && property != M_CONST.START_PROP)
				&&(game.map.properties[property].owner == M_CONST.NO_OWNER)
					&&(player.money > game.map.properties[property].value)){
						player.money -= game.map.properties[property].value;
						game.map.properties[property].owner = player.playerName;
						player.propOwned.push(property);
						socket.emit("mpBuySuccess");
						socket.broadcast.to(game.id).emitR("mpBuyOther", player.playerName, property);
						global.log('verbose', player.playerName + " has bought " + game.map.properties[property].id);
			}else{
				global.log('info', player.playerName + " not allowed to buy " + game.map.properties[property].id);
				socket.emit("mpBuyFail");
			}
		}
	});

	socket.on('mpEndGame', function(){
		var player = findPlayer(socket);
		var game = findGame(socket);
		if(game.creator == player.playerName)
			game.mp.end();
	});

	socket.on('getPlaceList', function()
	{
		socket.emit('placeListReceived', JSON.stringify(places.placeList))
	})
	socket.on('PING2', function(garb1, garb2){
		
		console.log('PING2 RECEIVED');
	});
}

module.exports.mp = mp;
module.exports.init = init;






