function init(url){

			var socket = io.connect(url);

			var playerName, game;

			socket.on('createNewGameSuccess', function(){
				setCookie('game', game);
				alert("Connected to game: " + game);
			});
		
			socket.on('newPlayerAdded', function(userName, totalPlayers){
				alert(userName + ' has connected!' + ' '+ totalPlayers + ' players are now in this game!!!');
			});

			socket.on('addToGameError', function(err){
				alert(err);
			});

			// $('#start-game').click(function(){
			// 	game = prompt ("Enter a new id for your game:");
			// 	if(game != '')
			// 		socket.emit('createNewGame', game);
			// })

			monopoly.init()
		}	
