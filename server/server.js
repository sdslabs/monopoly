//Constants

var constants = require('./constants.json');
const G_MAX_PLAYERS_PER_GAME = parseInt(constants.G_MAX_PLAYERS_PER_GAME);
const G_SERVER_PORT = parseInt(constants.G_SERVER_PORT);

//Server

var express = require('express');
var http = require('http')

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(G_SERVER_PORT);

// All routing goes here.
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/favicon.ico', function(req, res){
	res.sendfile(__dirname + '/index.html');
})

//Runtime Variables

var ggames = {};	//Active Games
var gplayers = {}; //Global Player List

ggames['game1'] = {};
ggames['game1'].players = 0;

//Authenication Needed
io.sockets.on('connection', function (socket){
	socket.on('addNewPlayer', function(userName){
		socket.userName = userName;
		gplayers[userName] = userName;
		socket.emit('addNewPlayerSuccess', userName)	
	});

	socket.on('createGame', function(game){
		if(gplayers[socket.userName]==''){
			socket.emit('createGameError', 'Unauthorized access');
			console.log('Illegal request to '+ game);
		}
		else
		{
			ggames[game] = {};
			socket.game = game;
			ggames[game].players+=1;	
			gplayers[userName] = userName;
			socket.join(game);
			socket.emit('addToGameSuccess', 'Connected to game: '+game);
			socket.broadcast.to(game).emit('newPlayerAdded', socket.userName);
			console.log('New player ' + socket.userName +' has connected to game: ' + game);
		}
	});

	socket.on('addToGame', function(game){
		if(gplayers[socket.userName]=={}){
			socket.emit('addToGameError', 'Unauthorized access');
			console.log('Illegal request to '+ game);
		}
		else if(ggames[game].players<G_MAX_PLAYERS_PER_GAME)
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

	socket.on('exitFromGame', function(){
		console.log(socket.userName +' has left the game: ' + socket.game);
		socket.leave(socket.game);
		
		if(ggames['game'].players<=1)
		{
			delete ggames[socket.game];
			console.log('Game: ' + game + 'has been destroyed');
		}
		else
			socket.broadcast.to(socket.game).emit('playerExited', socket.userName);
		socket.emit('exitFromGameSuccess', 'socket.game');
		socket.game = "";
	});

});