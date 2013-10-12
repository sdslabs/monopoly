//Load Constants
var CONST = require('./constants.js');

//Load the Global Function Module
var global = require('./global.js');

//Load the game module
var objects = require('./game/objects.js');

//Load the cookie module
var cookie = require('cookie');

var parseSignedCookies = require('express/node_modules/connect/lib/utils').parseSignedCookies;

//Load the MySQL Driver
var db = require('./db.js');
var dbConnect = db.connection;

//Global Objects containing current game and player info
var Games = {};	//Active Games
var Players = {}; //Global Player List


function doesGameExist(game){
	return Games.hasOwnProperty(game);
}

function doesPlayerExist(playerName){
	return Players.hasOwnProperty(playerName);
}

function getGameList(){
	return Games;
}

function getPlayerList(){
	return Players;
}

function removePlayerFromGame(socket){
	if(doesPlayerExist(socket.playerName)){
		game = Players[socket.playerName].getCurrentGame();
		if(doesGameExist(game)){
			Games[game].removePlayer(socket.playerName);
			global.log('info', socket.playerName +' has left the game: ' + game);

			if(Games[game].getTotalPlayers()<1){
				delete Games[game];
				global.log('info', 'Game: ' + game + ' has been destroyed');
			}
			else{	
				socket.broadcast.to(game).emit('playerExited', socket.playerName);
				socket.emit('exitFromGameSuccess', 'socket.game');
			}	

			socket.leave(game);
			Players[socket.playerName].setCurrentGame(null);
			return true;
		}
		else
			return false;
	}
}

function initialize(io, express){
	//Authenication Needed
	io.set('authorization', function (data, accept) {
   		// check if there's a cookie header
    	if (data.headers.cookie) {
        	// if there is, parse the cookie
        	data.cookie = cookie.parse(data.headers.cookie);

        	var parsedCookie = data.cookie['connect.sid'].substring(2,26); 

        	if( parsedCookie != parseSignedCookies(data.cookie,
        								 CONST.G_EXPRESS_SESSION_SECRET)['connect.sid']){
        		accept('Cookie signature check failed', false);
        		global.log('warn', 'Cookie signature check failed. Connection terminated.');
        	}
        	// retrive the cookie
        	data.sessionID = parsedCookie;
        	data.initialized = false;
    	} else {
       	// if there isn't, turn down the connection with a message
       	// and leave the function.
       	return accept('No cookie transmitted.', false);
    	}
    	// accept the incoming connection
    	accept(null, true);
	});

	io.sockets.on('connection', function (socket){

		socket.on('addNewPlayer', function(playerName){
			if(playerName!=null){
				if(!doesPlayerExist(playerName)&&
					playerName.replace(/\s/g, '')!=''
					&&!socket.hasOwnProperty(playerName)){

						dbConnect.query('SELECT player, game FROM sktio WHERE session = \"'+socket.handshake.sessionID+'\"',
        					function(err, row, fields){
        					if(err)
        						throw err;
        					if(row[0]){
        						if(row[0].hasOwnProperty('player')){
        			 				socket.playerName = row[0].player;
        			 				socket.handshake.initialized = true;

        			 				if(playerName!=socket.playerName)
        			 					global.log("warn", "Player: "+ socket.playerName +" tried to reconnect with alias: "+ playerName + ". Denied");

        			 				global.log("info", "Player " + socket.playerName + " has reconected to server");
        			 			}
        			 		}
        			 		else{
        			 			var Query = 'INSERT into sktio (session, player) VALUES '+'(\"'
									+socket.handshake.sessionID+'\"'+', \"'+playerName+'\")';
								dbConnect.query(Query,
									function(err, row, fields){
										if(err)
											throw err;	
								});
									
								socket.playerName = playerName;
								socket.handshake.initialized = true;

        			 			Players[socket.playerName] = new objects.Player(socket.playerName,
        			 				socket.handshake.sessionID, '', socket);
        			 				
								socket.emit('addNewPlayerSuccess');
								global.log('info', 'Player: ' + socket.playerName + ' logged in.');
        			 		} 	
        				});
				}
				else{
					socket.emit('addNewPlayerFailed', playerName + ' already exists or illegal name');
					global.log('warn', playerName + ' was refused connection. Already exists.');
				}
			}
			else{
				socket.emit('addNewPlayerFailed', playerName + ' player name cannot be null');
				global.log('warn', playerName + ' was refused connection. Invalid name.');
			}
		});
		
		socket.on('createNewGame', function(game){
			if(!doesGameExist(game)&&doesPlayerExist(socket.playerName)&&Players[socket.currentGame]==null&&game!=''){
					dbConnect.query('SELECT game FROM sktio WHERE session = \"'+socket.handshake.sessionID+'\"',
        					function(err, row, fields){
        					if(err)
        						throw err;
        					if(row[0]){
        						if(row[0].game!=null){
        							Players[socket.playerName].currentGame = row[0].game;
        			 				global.log("info", "Player " + socket.playerName + " has reconected to game: "+ row[0].game);
        			 			}
        			 			else{
									var Query = 'UPDATE sktio SET game = '+'\"'+game+'\" WHERE session = \"'+Players[socket.playerName].getSessionID()+'\"';
									dbConnect.query(Query,
										function(err, row, fields){
											if(err)
												throw err;	
									});
									socket.join(game);
									Games[game] = new objects.Game(socket.playerName, socket);
									Games[game].addPlayer(socket.playerName);
									Players[socket.playerName].setCurrentGame(game);

									socket.emit('createNewGameSuccess', 'Connected to game: '+game);
									socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName);
									global.log('info', socket.playerName +' connected to game: ' + game);
								}
							}
						});
			}
			else{
				socket.emit('addToGameError', 'Not authorized to create game');
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to create game: ' + game);
			}
		});

		socket.on('addToGame', function(game){
			if(doesGameExist(game)&&doesPlayerExist(socket.playerName)&&Players[socket.currentGame]==null&&game!=''){
				if(Games[game].morePlayersAllowed()){
								
					dbConnect.query('SELECT game FROM sktio WHERE session = \"'+socket.handshake.sessionID+'\"',
        					function(err, row, fields){
        					if(err)
        						throw err;
        					if(row[0]){
        						if(row[0].game!=null){
        							Players[socket.playerName].currentGame = row[0].game;
        			 				global.log("info", "Player " + socket.playerName + " has reconected to game: "+ row[0].game);
        			 			}
        			 			else{
									var Query = 'UPDATE sktio SET game = '+'\"'+game+'\" WHERE session = \"'+Players[socket.playerName].getSessionID()+'\"';
									dbConnect.query(Query,
										function(err, row, fields){
											if(err)
												throw err;	
									});
									socket.join(game);

									Games[game].addPlayer(socket.playerName);
									Players[socket.playerName].setCurrentGame(game);
						
									socket.emit('addToGameSuccess');
									socket.broadcast.to(game).emit('newPlayerAdded', socket.playerName, Games[game].players);
									global.log('info', 'Player ' + socket.playerName +' has connected to game: ' + game);
								}
							}
						});
				}	
				else{	
					socket.emit('addToGameError', 'This game is full!!!');
					global.log('warn', 'Player ' + socket.playerName + ' refused access to '+ game + '.This game is full.');
				}
			}
			else{
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to join game: '+game);
			}
		});

	 	socket.on('queryPlayerList', function(){
		 	if(doesPlayerExist(socket.playerName)){
		 		playerList = {};
		 		for(var key in Players)
		 			if(doesPlayerExist(key))
		 				playerList[key] = '';
		 		socket.emit('updatePlayerList', JSON.stringify(playerList));
		 		global.log('info', 'Player list sent to player: ' + socket.playerName);
		 	}
		 	else{
		 		global.log('warn', 'Player list not sent to: ' + socket.playerName)
		 	}
		});

		socket.on('queryGameList', function(){
			if(doesPlayerExist(socket.playerName)){
				gameList = {};
		 		for(var key in Games)
		 			if(doesGameExist(key))
		 				gameList[key] = '';
				socket.emit('updateGameList', JSON.stringify(gameList));
				global.log('info', 'Game list sent to player: ' + socket.playerName);
			}
			else{
		 		global.log('warn', 'Game list not sent to: ' + socket.playerName)
		 	}
		});
		
		socket.on('exitFromGame', function(){
			if(removePlayerFromGame(socket)){
				var Query = 'UPDATE sktio SET game = '+'null WHERE session = \"'+Players[socket.playerName].getSessionID()+'\"';
				dbConnect.query(Query, function(err, row, fields){
					if(err)
						throw err;	
				});
			}
			else
				global.log('warn', 'Illegal request to exit game from player: '+ socket.playerName);
		});

		socket.on('logout', function(){
			if(socket.handshake.initialized){
				db.SessionStore.get ( socket.handshake.sessionID, function(err, session){
					if (err || !session) {
                		global.log('error', " could not load the Session Store.");
                		socket.emit('logoutFail', 'Internal Server error occured');
                	}
                	else{
                		var Query = 'DELETE FROM sktio WHERE session = \"'+Players[socket.playerName].getSessionID()+'\"';
							dbConnect.query(Query, 
								function(err, row, fields){
									if(err)
										throw err;
										});	
						var Query = 'DELETE FROM Sessions WHERE sid = \"'+Players[socket.playerName].getSessionID()+'\"';
							dbConnect.query(Query, 
								function(err, row, fields){
									if(err)
										throw err;	
									});

						removePlayerFromGame(socket);
                		global.log('info', "Player: " + socket.playerName + " has logged out.");
                		delete Players[socket.playerName];
                		delete socket.playerName;
                		socket.emit('logoutSuccess');
                		socket.disconnect();
					}
				}); 
			}
			else{
				global.log('warn', " Illegal logut request detected.");
                socket.emit('logoutFail', 'Not logged into server');
			}
		});	

		socket.on('disconnect', function(){
			if(socket.handshake.initialized){
				global.log('info', 'Player: ' + socket.playerName + ' has timed out (removing from server)');
				removePlayerFromGame(socket);
				delete Players[socket.playerName];
        	    delete socket.playerName;
    	    }
		});

		socket.on('PING', function(){
			// console.log(Games[Players[socket.playerName].getCurrentGame()]);
			console.log('PING RECEIVED');
		})
	});
}

module.exports.initialize = initialize;
module.exports.getGameList = getGameList;
module.exports.getPlayerList = getPlayerList;