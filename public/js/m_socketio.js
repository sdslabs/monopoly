var socketio = (function()
{
	// var socket;

	var init = function(address)
	{	
		socket = io.connect(address);
		socket.on('connect', onConnect);
		socket.on('addNewPlayerSuccess', addNewPlayerSuccess); 
		socket.on('addToGameSuccess', addToGameSuccess); 
		socket.on('updateGameList', angularjs.updateGameList)
		socket.on('updatePlayerList', monopoly.updatePlayerList)
		socket.on('createNewGameSuccess', createNewGameSuccess)
		socket.on('newPlayerAdded', newPlayerAdded)
		socket.on('gameListChanged', request)
		socket.on('playerListChanged', request)
		socket.on('exitFromGameSuccess', exitFromGameSuccess)
		socket.on('beginGame', monopoly.beginGame)
		socket.on('placeListReceived', gPlaces.setPlaceList)
		socket.on('endGame', monopoly.endGame)

		var arr = ['mpInitBy', 'mpInitSuccess', 'mpMoveSuccess', 'mpMoveOther', 'mpMoveFail', 'mpBuySuccess', 'mpBuyOther', 'mpBuyFail',
		'PING'];
		for(var key in arr)
		{
			var event = arr[key]
			// addHandler(event)
		}
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
		request('queryPlayerList')
	};
	var createNewGameSuccess = function(data){
		request('queryPlayerList')
	};
	var newPlayerAdded = function(data){
		console.log("Player "+data+" has joined the game!");
	};
	var exitFromGameSuccess = function()
	{
		request('queryGameList')
	}
	// var getGameList = function()
	// {
	// 	socket.emit('queryGameList');
	// }
	// var getPlayerList = function()
	// {
	// 	socket.emit('queryPlayerList');
	// }
	var createGame = function(gameName)
	{
		socket.emit('createNewGame', gameName)
	}
	var joinGame = function(gameName)
	{
		socket.emit('addToGame', gameName)
	}

	var addHandler = function(on)
	{
		socket.on(on, function(data)
		{
			console.log(data)
		})
	}
	// var beginGame = function()
	// {
	// 	socket.emit('beginGame')
	// }
	// var exitFromGame = function()
	// {
	// 	socket.emit('exitFromGame')
	// }
	// var getPlaceList = function()
	// {
	// 	socket.emit('getPlaceList')
	// }

	var request = function(message)
	{
		console.log('requesting '+message)
		socket.emit(message)
	}

	return {
		init: init,
		createGame:createGame,
		joinGame:joinGame,
		request:request,
		addHandler:addHandler
	}
})();