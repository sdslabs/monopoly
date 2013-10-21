function init(url){
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

			var socket = io.connect(url);

			var playerName, game;

			socket.on('connect', function(){
				playerName=getCookie('playerName');

				if(playerName == '' || playerName == null){
					playerName = prompt("What's your name?");

					if(playerName=='')
						window.location = 'https://sdslabs.co.in';
				}
				
				socket.emit('addNewPlayer', playerName);
			});


			socket.on('addNewPlayerSuccess', function(){
				setCookie('playerName', playerName, 1);	
			});

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

			$('#start-game').click(function(){
				game = prompt ("Enter a new id for your game:");
				if(game != '')
					socket.emit('createNewGame', game);
			})
		}	
