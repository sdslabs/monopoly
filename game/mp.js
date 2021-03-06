//Load Game Specific Constants
var M_CONST = require('../JSON/m_constants.json');

//Load the Global Function Module
var global = require('../global.js');

// Load the authorization module
var auth = require('../auth-main.js');

//Load Constants
var CONST = require('../constants.js');

var Games = null;
var Players = null;
var game = null;
var j =0;
function mp(game, socket){
	// this.startedAt = new Date();
	this.game = game;
	this.started = false;
	this.socket = socket;
	this.turnsPlayed = 0;
	this.currentPlayer = null;
}

// mp.socket stores the creator's socket

mp.prototype.getNextPlayer = function(socket){

	if(this.started){
		var players = findGame(socket).getPlayers();
		if(this.currentPlayer){
			this.currentPlayer = players[(players.indexOf(this.currentPlayer)+1)%players.length];
			socket.emit('mpTurn', this.currentPlayer);
			socket.broadcast.to(this.game.id).emit('mpTurn', this.currentPlayer);
		}
		else
			this.currentPlayer = players[0];
		global.log('verbose', "Player: " + this.currentPlayer + "'s' turn is next.")
		return this.currentPlayer;
	}
	return null;
}

mp.prototype.levyTax = function(socket, route){
	for (var i =0; i<route.length; i++){
		var prop = route[i]+'';
		var player = findPlayer(socket);
		if(this.game.map.properties[prop].owner != M_CONST.NO_OWNER &&
			this.game.map.properties[prop].owner != player.playerName){
			if(i == route.length -1){
				player.money -= this.game.map.properties[prop].value*M_CONST.TAX_FROM_PLAYER;
				Players[this.game.map.properties[prop].owner].money += this.game.map.properties[prop].value*M_CONST.TAX_TO_OWNER;
			}else{
				player.money -= this.game.map.properties[prop].value*M_CONST.TAX_FOR_TRAVEL_FROM_PLAYER;
				Players[this.game.map.properties[prop].owner].money += this.game.map.properties[prop].value*M_CONST.TAX_FOR_TRAVEL_TO_OWNER;
			}	
		}
	}
	socket.emit("mpTaxLevied");
	socket.emitR("mpTaxLevied", player.playerName);
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

	for(var i = 0; i < players.length; i++){
		auth.removePlayerFromGameSp(Players[players[i]].socket);
		db.updateScore(Players[players[i]].sessionID, Players[players[i]].money);
		Players[players[i]].reset();
	}

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

function verifyRoute(route, socket){
	var game = findGame(socket);
	if(route&&game)
		if(route.length>0&&route.length<=M_CONST.MAX_DICE_VAL){
			var first = route[0];
			for(var i = 1; i<route.length; i++)
				if(!game.map.doesPropExist(route[i])||route[0]==route[i])
					return false;
			return true;
		}
	return false;
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
			socket.emit('beginGame');
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

			if(socket.playerName==game.creator)
				game.mp.getNextPlayer(socket);
			socket.emit("mpInitSuccess");
			socket.broadcast.to(game.id).emit("mpInitBy", player.playerName);
		}else{
			global.log('warn', 'Game could not be found');
		}

	});

	socket.on('mpMove', function(route){
		var game = findGame(socket);
		var player = findPlayer(socket);
		var flag = false;
		var currentProp = player.locProp;

		if(game&&game.mp.started
				&&game.mp.currentPlayer==socket.playerName
				&&verifyRoute(route, socket)){
			var i = 0, moves = route.length;
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
				
			if(!flag){
				game.mp.turnsPlayed++;
				if(game.mp.turnsPlayed > M_CONST.END_GAME_LIM)
					game.mp.end();
				if(!(game.mp.turnsPlayed % M_CONST.MONEY_RFRSH_LIM))
					game.mp.provideMoney();
				game.mp.levyTax(socket, route);
				var nextPlayer = game.mp.getNextPlayer(socket);
				socket.emit("mpMoveSuccess");
				socket.broadcast.to(game.id).emit('mpMoveOther', route);
				global.log('verbose', socket.playerName + " moved in game " + player.getCurrentGame() + ". Route " + route + ".");
			}
			else{
				player.locProp = currentProp;
				socket.emit("mpMoveFail");
			}
		}
	});

	socket.on("mpBuy", function(){
		var player = findPlayer(socket);
		var game = findGame(socket);
		var property = player.locProp;

		if(game&&game.mp.started){
			if((game.mp.currentPlayer == player.playerName)
			&&(game.map.properties.hasOwnProperty(property) && property != M_CONST.START_PROP)
				&&(game.map.properties[property].owner == M_CONST.NO_OWNER)
					&&(player.money > game.map.properties[property].value)){
						player.money -= game.map.properties[property].value;
						game.map.properties[property].owner = player.playerName;
						player.propOwned.push(property);
						socket.emit("mpBuy", player.playerName, property);
						socket.broadcast.to(game.id).emitR("mpBuy", player.playerName, property);
						global.log('verbose', player.playerName + " has bought " + game.map.properties[property].id);
			}else{
				global.log('info', player.playerName + " not allowed to buy");
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

	socket.on('queryAllData', function(){
		var game = findGame(socket);
		if(game&&game.mp.started){
			var _players = [];
			for (var i=0; i < game.players.length; i++){
				var _player = Players[game.players[i]];
				var player = {};
				player.playerName = _player.playerName;
				player.currentGame = _player.currentGame;
				player.money = _player.money;
				player.propOwned = _player.propOwned;
				_players.push(player);
			}

			var _game = {};
			_game.id = game.id;
			_game.creator = game.creator;
			
			socket.emit('updateGameData', {
				game: _game,
				players: _players
			});
		}
	});

	socket.on('queryPlayerData', function(playerName)
	{
		var _player = {}, player = {};

		if(typeof(playerName) == undefined)
			_player = Players[playerName];
		else
			_player = Players[socket.playerName]

		if(_player == {})
			socket.emit('playerNotFound')
		else
		{
			player.playerName = _player.playerName;
			player.currentGame = _player.currentGame;
			player.money = _player.money;
			player.propOwned = _player.propOwned;

			socket.emit('updatePlayerData', player);
		}
	})

	socket.on('getPlaceList', function()
	{
		var places = require('../JSON/maps/'+'iitr'+'/places.json');
		socket.emit('placeListReceived', JSON.stringify(places.list))
	})
	socket.on('PING2', function(garb1, garb2){
		
		console.log(findGame(socket));
		console.log('PING2 RECEIVED');
	});
	socket.on('PING3', function(garb1, garb2){
		
		// socket.emit('PING', findGame(socket).map.properties);
		console.log('PING2 RECEIVED');
		console.log(M_CONST);
	});
}

module.exports.mp = mp;
module.exports.init = init;






