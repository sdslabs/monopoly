var express = require('express');
var http = require('http')

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

// All routing goes here.
app.get('/', function (request, response) 
{
	res.sendfile(__dirname + '/index.html');
});

//Constants

var constants = require('./constants.json');
const G_MAX_PLAYERS_PER_GAME = parseInt(constants.G_MAX_PLAYERS_PER_GAME);
console.log(G_MAX_PLAYERS_PER_GAME);
//Runtime Variables

var ggames = {};	//Active Games
var gplayers = {}; //Global Player List

io.sockets.on('connection', function (socket){
	socket.on('newPlayer', function(userName, game){
		socket.userName = userName;
		if(ggames['game'].players<G_MAX_PLAYERS_PER_GAME)
		{
			socket.game = game;
			ggames['game'].players++;	
			gplayers['userName'] = userName;
			socket.join(ggames['game']);
			socket.emit('newPlayerSuccess', 'Connected to game: '+game);
		}	
		else
			socket.emit('newPlayerError', 'This game is full');
		console.log('New player ' + socket.userName +' has connected to game: ' + game);	
	});

	socket.on('exitGame', function(){
		console.log('Player ' + socket.userName +' has left the game: ' + game);
		socket.leave(socket.game);
		if(ggames['game'].players<=1)
		{
			delete ggames[socket.game];
			console.log('Game: ' + game + 'has been destroyed');
		}
		else
			socket.broadcast.to(socket.room).emit('playerExited', socket.userName, ggames[socket.game].players);
		socket.emit('exitGameSuccess', 'Exited from game: '+socket.game);
		socket.game = "";
	});

});