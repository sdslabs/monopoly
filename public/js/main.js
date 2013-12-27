var monopoly = (function()
{
	var showScreen = function(id) 
	{
		$('.game-layer').hide()
		$(id).show()
	};
	var addButtonHandlers = function()
	{
		$('#start-btn').click(onStartClick);
		$('#create-btn').click(onCreateClick);
		$('#back-btn').click(onBackClick);
		$('.join-btn').on('click', onJoinClick);

	};

	var onStartClick = function()
	{
		showScreen('#lobby-screen');
		socketio.getGameList();
	}
	var onCreateClick = function()
	{
		var gameName = prompt("Enter a game name");
		socketio.createGame(gameName);
	}
	var onBackClick = function()
	{
		showScreen('#start-screen');
	}
	var onJoinClick = function()
	{
		socketio.joinGame($(this).attr('id'))
	}
	var showGameList = function(gameList)
	{
		console.log(gameList);
		gameList = JSON.parse(gameList);
		$('div#lobby-screen td').remove()
		for(var key in gameList)
		{
			var game = gameList[key];
			console.log(gameList[key])
			var gameStatus = game['numPlayers'] == 1 ? 'Waiting' : game['numPlayers'] == 2 ? 'Ongoing' : 'Complete';
			$('div#lobby-screen tbody').append('<tr><td>'+(parseInt(key)+1)+'</td><td>'+game['name']+'</td><td>'
												+game['creator']+'</td><td>'+gameStatus+'</td><td><button type="button" id="'+game['name']
												+'"class="btn btn-primary join-btn">Join</button></td></tr>');
		}
		addButtonHandlers()
	}

	return {
		init:function() 
		{
			showScreen('#start-screen')
			addButtonHandlers();
			socketio.init();
			// monopoly.canvas = $('#gamecanvas')[0];
			// monopoly.context = monopoly.canvas.getContext('2d');
		},
		showGameList:showGameList
	}
})();

var socketio = (function()
{
	// var socket;

	var init = function()
	{	
		socket = io.connect('http://localhost:8081');
		socket.on('connect', onConnect);
		socket.on('addNewPlayerSuccess', addNewPlayerSuccess); 
		socket.on('addToGameSuccess', addToGameSuccess); 
		socket.on('updateGameList', monopoly.showGameList)
		socket.on('createNewGameSuccess', createNewGameSuccess)
		socket.on('newPlayerAdded', newPlayerAdded)
	}	

	var setCookie = function(c_name,value,exdays){	
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	}
	var getCookie = function(c_name){
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

	var onConnect = function(){
		playerName=getCookie('playerName');

		if(playerName == '' || playerName == null){
			playerName = prompt("What's your name?");

			if(playerName=='')
				window.location = 'https://sdslabs.co.in';
		}
		
		socket.emit('addNewPlayer', playerName);
	};
	var addNewPlayerSuccess = function(){
		setCookie('playerName', playerName, 1);	
	};
	var addToGameSuccess = function(data){
		console.log("Successfully joined game " + data)
	};
	var createNewGameSuccess = function(data){
		console.log(data);
	};
	var newPlayerAdded = function(data){
		console.log("Player "+data+" has joined the game!");
	};
	var getGameList = function()
	{
		socket.emit('queryGameList');
	}
	var createGame = function(gameName)
	{
		socket.emit('createNewGame', gameName)
	}
	var joinGame = function(gameName)
	{
		socket.emit('addToGame', gameName)
	}

	return {
		init: init,
		getGameList:getGameList,
		createGame:createGame,
		joinGame:joinGame
	}
})();
