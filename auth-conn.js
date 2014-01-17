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

var auth = require('./auth-main.js');

function initialize(io, express){
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

        	// Production
    		// check for authentication
			// require('./sds_auth.js').user.check_login(data.headers.cookie['sds_login'], function(uid){
			// 	if(uid == null || uid == 0)
			// 		accept("Auth failed", false);
			// });

        	db.SessionStore.get(data.sessionID, function(err, req){
        		if(req.hasOwnProperty(uid))
        			if(req.uid!=null || req.uid != '')
        				// accept the incoming connection
        				return accept(null, true);
        		return accept('Auth failure', false);
        	});
    	}
       	// if there isn't, turn down the connection
       	return accept(null, false);
	});

	io.sockets.on('connection', function (socket){

		//Adds more handlers for socket.
		objects.init(auth.Games, auth.Players, socket);

		socket.on('addNewPlayer', function(playerName){
				if(!auth.doesPlayerExist(playerName)
					&&auth.isValid(playerName)
					&&!socket.hasOwnProperty(playerName)) {
					db.retrivePlayer(socket.handshake.sessionID, 
        				function(player){
        					if(player != '')
        		 				playerName = player;
       			 			else
								db.addPlayer(socket.handshake.sessionID, playerName);
							socket.playerName = playerName; 
       			 			auth.Players[socket.playerName] = new objects.Player(socket.playerName,
	        			 		socket.handshake.sessionID, socket);
       			 			socket.handshake.initialized = true;
       			 			socket.emit('addNewPlayerSuccess');
       			 			global.log('info', 'Player: ' + socket.playerName + ' logged in.');	
       					});
				}else{
					socket.emit('addNewPlayerFailed','Player already exists or illegal name');
					global.log('warn', socket.handshake.address.address + ' was refused connection. Player already exists or illegal name');
				}
		});
		
		socket.on('createNewGame', function(game){
			if(!auth.doesGameExist(game)&&auth.doesPlayerExist(socket.playerName)&&auth.Players[socket.playerName].getCurrentGame()==null&&game!=''){
			// 	db.retriveGame(socket.handshake.sessionID, 
   //      			function(dbGame){
   //      				if(dbGame != ''){
   //      					auth.Players[socket.playerName].currentGame = dbGame;
   //      			 		global.log("info", "Player " + socket.playerName + " has reconected to game: "+ dbGame);
   //      			 	}else{
							auth.Games[game] = new objects.Game(socket.playerName, game, socket);
							auth.addPlayerToGame(game, socket);
							socket.emit('createNewGameSuccess');
						// }
					// });
			}else{
				socket.emit('addToGameError', 'Not authorized to create game');
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to create game: ' + game);
			}
		});

		socket.on('addToGame', function(game){
			if(auth.doesGameExist(game)&&auth.doesPlayerExist(socket.playerName)&&auth.Players[socket.currentGame]==null&&game!=''){
				if(auth.Games[game].morePlayersAllowed()){		
					// db.retriveGame(socket.handshake.sessionID, 
     //    				function(dbGame){
     //    					if(dbGame != ''){
     //    						auth.Players[socket.playerName].currentGame = dbGame;
     //    				 		global.log("info", "Player " + socket.playerName + " has reconected to game: "+ dbGame);
     //    				 	}else{
								auth.addPlayerToGame(game, socket);
								socket.emit('addToGameSuccess', game);
							// }
						// });
				}else{	
					socket.emit('addToGameError', 'This game is full!!!');
					global.log('warn', 'Player ' + socket.playerName + ' refused access to '+ game + '.This game is full.');
				}
			}
			else{
				global.log('warn', 'Player ' + socket.playerName + ' not allowed to join game: '+game);
			}
		});

	 	socket.on('queryPlayerList', function(){
		 	if(auth.doesPlayerExist(socket.playerName)){
		 		playerList = [];
		 		var playerNames = auth.Games[auth.Players[socket.playerName].getCurrentGame()].getPlayers()
		 		for(var key in playerNames)
		 		{
		 			var playerName = playerNames[key]
		 			if(auth.doesPlayerExist(playerName))
		 				playerList.push({'name':playerName});
		 		}
		 		socket.emit('updatePlayerList', JSON.stringify(playerList));
		 		global.log('info', 'Player list sent to player: ' + socket.playerName);
		 	}
		 	else{
		 		global.log('warn', 'Player list not sent to: ' + socket.playerName)
		 	}
		});

		socket.on('queryGameList', function(){
			if(auth.doesPlayerExist(socket.playerName)){
				var gameList = [];
		 		for(var key in auth.Games)
		 			if(auth.doesGameExist(key))
		 				gameList.push({'name':key, 'creator':auth.Games[key].getCreator(), 'numPlayers':auth.Games[key].getTotalPlayers()});
				socket.emit('updateGameList', JSON.stringify(gameList));
				global.log('info', 'Game list sent to player: ' + socket.playerName);
			}
			else{
		 		global.log('warn', 'Game list not sent to: ' + socket.playerName)
		 	}
		});
		
		socket.on('exitFromGame', function(){
			if(!auth.removePlayerFromGame(socket))
				global.log('warn', 'Illegal request to exit game from player: '+ socket.playerName);
			else
				socket.emit('exitFromGameSuccess', 'socket.game');
		});

		socket.on('logout', function(){
			if(socket.handshake.initialized){
				db.SessionStore.get ( socket.handshake.sessionID, function(err, session){
					if (err || !session) {
                		global.log('error', " could not load the Session Store.");
                		socket.emit('logoutFailed', 'Internal Server error occured');
                	}
                	else{
                		auth.removePlayerFromServer(socket);
                		global.log('info', "Player: " + socket.playerName + " has logged out.");
					}
				}); 
			}
			else{
				global.log('warn', " Illegal logut request detected.");
                socket.emit('logoutFail', 'Not logged into server');
			}
		});	

		// Fires when client abruptly terminates connection
		socket.on('disconnect', function(){
			if(socket.handshake.initialized){
				global.log('info', 'Player: ' + socket.playerName + ' has timed out (removing from server)');

				auth.removePlayerFromGame(socket);
				delete auth.Players[socket.playerName];
        	    delete socket.playerName;
    	    }
		});

		// Debug
		socket.on('PING', function(){
			console.log('PING RECEIVED');
			console.log(db.SessionStore);
		});
	});
}

module.exports.initialize = initialize;
// module.exports.getGameList = getGameList;
// module.exports.getPlayerList = getPlayerList;