function init(){
		function setCookie(c_name,value,exdays){	
			var exdate=new Date();
				exdate.setDate(exdate.getDate() + exdays);
				var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
				document.cookie=c_name + "=" + c_value;
			}

			function getCookie(c_name){
				var c_value = document.cookie;
				var c_start = c_value.indexOf(" " + c_name + "=");
				if (c_start == -1){
					c_start = c_value.indexOf(c_name + "=");
				}
				if (c_start == -1){
					c_value = null;
				}
				else{
					c_start = c_value.indexOf("=", c_start) + 1;
					var c_end = c_value.indexOf(";", c_start);
					if (c_end == -1){
						c_end = c_value.length;
					}
					c_value = unescape(c_value.substring(c_start,c_end));
				}
				return c_value;
			}

			var socket = io.connect('http://127.0.0.1:8080');

			var playerName, game;

			socket.on('connect', function(){
				playerName=getCookie('playerName');
				game=getCookie('game');

				if(playerName && game){
					socket.emit('addNewPlayer', playerName);
					socket.emit('createNewGame', game);
				}
				else{
					playerName = prompt("What's your name?");
					game = prompt("Create a new game:")
					socket.emit('addNewPlayer', playerName);
				}

			});


			socket.on('addNewPlayerSuccess', function(){
				setCookie('playerName', playerName, 1);
				socket.emit('createNewGame', game);
			// 	socket.emit('queryPlayerList');
			// 	socket.emit('queryGameList');
			});

			socket.on('createNewGameSuccess', function(){
				setCookie('game', game);
			});
		
			socket.on('newPlayerAdded', function(userName, totalPlayers){
				alert(userName + ' has connected!' + ' '+ totalPlayers + ' players are now in this game!!!');
			});

			socket.on('addToGameError', function(err){
				alert(err);
			});

			socket.on('updatePlayerList', function(playerList){
				$('body').text(playerList);
			});

			socket.on('updateGameList', function(gameList){
			//	console.log(gameList);
				$('body').html($('body').html() + '<p>'+  gameList + '</p>');
			});

			socket.on('createNewGameSuccess', function(){
				socket.emit('queryGameList');
			});
		}