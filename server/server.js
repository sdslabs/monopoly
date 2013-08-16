//Load Constants
var CONST = require('./constants.js');


var express = require('express');
var http = require('http')
var app = express();
MySQLSessionStore = require('connect-mysql-session')(express, {log:false});

//Initialize Server 
var server = http.createServer(app);
var io = require('socket.io').listen(server, {log: CONST.G_LOG_REQUESTS});
server.listen(CONST.G_SERVER_PORT);

app.use(express.cookieParser());
app.use(express.session({
	store: new MySQLSessionStore(
		CONST.G_MYSQL_USERNAME,
		CONST.G_MYSQL_PASSWORD,
		CONST.G_MYSQL_DB,
		{
			logging: CONST.G_LOG_REQUESTS
		}),
	secret: CONST.G_EXPRESS_SESSION_SECRET
}));


//Initialize Router
var router = require('./router.js');
router.initialize(app);

//Runtime Variables
var ggames = {};	//Active Games
var gplayers = {}; //Global Player List

ggames['game'] = {};
ggames['game'].players = 0;

//Authenication Needed
io.sockets.on('connection', function (socket){
	socket.on('addNewPlayer', function(userName){
		socket.userName = userName;
		
		gplayers[userName] = {};
		gplayers[userName].lastActivity = new Date();
		gplayers[userName].currentGame = '';
		gplayers[userName].isAuth = true;

		socket.emit('addNewPlayerSuccess', userName);
	});

	socket.on('createGame', function(game){
		if(gplayers[socket.userName].isAuth == false){
			socket.emit('createGameError', 'Unauthorized access');
			console.log('Illegal request to create '+ game + ' by '+socket.userName);
		}
		else
		{
			socket.game = game;

			ggames[game] = {};
			ggames[game].players+=1;
			
			gplayers[socket.userName].currentGame = 'game';
				
			//gplayers[userName] = userName;
			socket.join(game);
			socket.emit('addToGameSuccess', 'Connected to game: '+game);
			socket.broadcast.to(game).emit('newPlayerAdded', socket.userName);
			console.log('New player ' + socket.userName +' has connected to game: ' + game);
		}
	});

	socket.on('addToGame', function(game){
		if(gplayers[socket.userName].isAuth == false){
			socket.emit('createGameError', 'Unauthorized access');
			console.log('Illegal request to create '+ game + ' by '+socket.userName);
		}
		else if(ggames[game].players<CONST.G_MAX_PLAYERS_PER_GAME)
		{
			socket.game = game;
			ggames[game].players+=1;	
			socket.join(game);
			socket.emit('addToGameSuccess', 'Connected to game: '+game);
			socket.broadcast.to(game).emit('newPlayerAdded', socket.userName, ggames[game].players);
			console.log('New player ' + socket.userName +' has connected to game: ' + game);
		}	
		else{	
			socket.emit('addToGameError', 'This game is full!!!');
			console.log(ggames[game] + ' '+ ggames[game].players);
		}
	});

	socket.on('queryPlayerList', function(){
		if(gplayers[socket.userName].isAuth == false){
			socket.emit('createGameError', 'Unauthorized access');
			console.log('Illegal request to create '+ game + ' by '+socket.userName);
		}
		else
			socket.emit('updateUserList', JSON.stringify(gplayers));
	});
	socket.on('exitFromGame', function(){
		if(gplayers[socket.userName].isAuth == false){
			socket.emit('createGameError', 'Unauthorized access');
			console.log('Illegal request to create '+ game + ' by '+socket.userName);
		}
		else{
			ggames[socket.game].players -= 1;
			socket.leave(socket.game);
			console.log(socket.userName +' has left the game: ' + socket.game);
			
			if(ggames['game'].players<1)
			{
				delete ggames[socket.game];
				console.log('Game: ' + game + 'has been destroyed');
			}
			else{	
				socket.broadcast.to(socket.game).emit('playerExited', socket.userName);
				socket.emit('exitFromGameSuccess', 'socket.game');
				socket.game = "";
			}
		}
	});
});