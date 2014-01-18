var monopoly = (function()
{
	var showScreen = function(id) 
	{
		$('.game-layer').hide()
		$(id).show()
	};
	var addButtonHandlers = function()
	{
		$('body').on('click','#start-btn', onStartClick);
		$('body').on('click','#create-btn', onCreateClick);
		$('body').on('click','#back-btn', onBackClick);
		$('body').on('click','.join-btn', onJoinClick);
		$('body').on('click','#leave-btn', onLeaveClick);
		$('body').on('click','#begin-btn', onBeginClick);
	};

	var onStartClick = function()
	{
		showScreen('#lobby-screen');
		socketio.getGameList();
	}
	var onCreateClick = function()
	{
		var gameName = prompt("Enter a game name");
		angularjs.initCreatorControls(true)
		showScreen('#room-screen');
		socketio.createGame(gameName);
	}
	var onBackClick = function()
	{
		showScreen('#start-screen');
	}
	var onJoinClick = function()
	{
		showScreen('#room-screen');
		socketio.joinGame($(this).attr('id'));
	}
	var onLeaveClick = function()
	{
		showScreen('#lobby-screen');
		socketio.exitFromGame($(this).attr('id'));
	}

	var onBeginClick = function()
	{
		socketio.beginGame()
		beginGame()
	}
	var beginGame = function()
	{
		showScreen('#game-screen');
	}
	var getPlaceList = function()
	{
		socketio.getPlaceList()
	}

	return {
		init:function(address) 
		{
			showScreen('#start-screen')
			addButtonHandlers();
			asyncScript.fetch();
			socketio.init(address);
			angularjs.init();
			G.init()
			beginGame(); //Temporarily added to easen testing of maps
			// monopoly.canvas = $('#gamecanvas')[0];
			// monopoly.context = monopoly.canvas.getContext('2d');
		},
		beginGame:beginGame,
		getPlaceList:getPlaceList
	}
})();

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
		socket.on('updatePlayerList', angularjs.updatePlayerList)
		socket.on('createNewGameSuccess', createNewGameSuccess)
		socket.on('newPlayerAdded', newPlayerAdded)
		socket.on('gameListChanged', getGameList)
		socket.on('playerListChanged', getPlayerList)
		socket.on('exitFromGameSuccess', exitFromGameSuccess)
		socket.on('beginGame', monopoly.beginGame)
		socket.on('placeListReceived', gPlaces.setPlaceList)


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
		getPlayerList()
	};
	var createNewGameSuccess = function(data){
		getPlayerList()
	};
	var newPlayerAdded = function(data){
		console.log("Player "+data+" has joined the game!");
	};
	var getGameList = function()
	{
		socket.emit('queryGameList');
	}
	var getPlayerList = function()
	{
		socket.emit('queryPlayerList');
	}
	var createGame = function(gameName)
	{
		socket.emit('createNewGame', gameName)
	}
	var joinGame = function(gameName)
	{
		socket.emit('addToGame', gameName)
	}

	var beginGame = function()
	{
		socket.emit('beginGame')
	}

	var exitFromGame = function()
	{
		socket.emit('exitFromGame')
	}
	var exitFromGameSuccess = function()
	{
		getGameList()
	}
	var getPlaceList = function()
	{
		socket.emit('getPlaceList')
	}

	return {
		init: init,
		getGameList:getGameList,
		getPlayerList:getPlayerList,
		createGame:createGame,
		joinGame:joinGame,

		beginGame:beginGame,

		exitFromGame:exitFromGame,
		getPlaceList:getPlaceList
	}
})();

var angularjs = (function()
{
	var monopolyApp = angular.module('monopoly-app', ['ngRoute']);
	monopolyApp.controller('game-list-controller', function($scope)
	{
		$scope.gameList = []
	});
	monopolyApp.controller('player-list-controller', function($scope)
	{
		$scope.playerList = []
		$scope.creatorCheck = false
	});

	return {
		init: function()
		{

		},

		updateGameList: function(list)
		{
			var scope = angular.element($('#lobby-screen')).scope()
			scope.$apply(function()
			{
				scope.gameList = []
				scope.gameList = JSON.parse(list)
			})
		},

		updatePlayerList: function(list)
		{
			var scope = angular.element($('#room-screen')).scope()
			scope.$apply(function()
			{
				scope.playerList = []
				scope.playerList = JSON.parse(list)
			})

		},

		initCreatorControls: function(creatorCheck)
		{
			var scope = angular.element($('#room-screen')).scope()
			scope.$apply(function()
			{
				scope.creatorCheck = creatorCheck
			})
		},

		monopolyApp: monopolyApp
	}
})();

var asyncScript = (function(){

	var fetch = function(){
		$.getScript('https://sdslabs.co.in/lollipop/topbarwide.css', onScrLoad);
		$.getScript('https://sdslabs.co.in/api/public/api.js', null);
	}

	var onScrLoad = function() {
		if(typeof topbar != 'undefined' && topbar != null){
			topbar.showTopbar();
		}
	}
	return {
		fetch: fetch
	}


})();

