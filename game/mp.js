//Load Game Specific Constants
var M_CONST = require('./m_constants.json');

//Load the Global Function Module
var global = require('../global.js');

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

mp.prototype.getNextPlayer = function(){
	var players = findGame(this.socket).getPlayers();
	this.currentPlayer = players[(players.indexOf(this.currentPlayer)+1)%players.length];
	return this.currentPlayer;
}

mp.prototype.levyTax = function(){
	var player =  findPlayer(this.socket);
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
		if(game.creator == socket.playerName && !game.mp.started){
			this.started = true;
			socket.broadcast.to(findGame(socket).id).emit('beginGame')
			// socket.emitR('beginGame');
		}
	})

	
	socket.on('mpCurrentPlayers', function(){
		var game = findGame(socket);
		if(game&&game.started){
			var players = game.getPlayers();
			if(players){
				socket.emit('mpCurrentPlayersSuccess', players);
				console.log(players);
			}
		}
	});

	socket.on('mpInitialize', function(){
		if(game&&game.started){	
			var player = findPlayer(socket);
			player.money = M_CONST.INITIAL_AMOUNT;
			player.locProp = M_CONST.START_PROP;
			socket.emit("mpInitSuccess");
			socket.emitR("mpInitBy", player.playerName);
		}

	});

	socket.on('mpMove', function(route){
		var moves = route.length;
		var game = findGame(socket);
		var player = findPlayer(socket);
		var flag = false;

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
				
			if(!flag){
				game.mp.turnsPlayed++;
				if(game.mp.turnsPlayed > M_CONST.MONEY_RFRSH_LIM)
					game.mp.provideMoney();
				game.mp.levyTax();
				var nextPlayer = game.mp.getNextPlayer();
				socket.emit("mpMoveSuccess", nextPlayer);
				socket.emitR('mpMoveOther', route, nextPlayer);
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
						socket.emitR("mpBuyOther", player.playerName, property);
						global.log('verbose', player.playerName + " has bought " + game.map.properties[property].id);
			}else{
				global.log('info', player.playerName + " not allowed to buy " + game.map.properties[property].id);
				socket.emit("mpBuyFail");
			}
		}
	});

	socket.on('PING2', function(garb1, garb2){
		
		console.log('PING2 RECEIVED');
		console.log(Players);
	});
}

module.exports.mp = mp;
module.exports.init = init;






