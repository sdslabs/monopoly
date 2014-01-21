var monopoly = (function()
{
	var playerList = []
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
		socketio.request('queryGameList');
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
		socketio.request('exitFromGame');
	}

	var onBeginClick = function()
	{
		socketio.request('beginGame')
		beginGame()
	}
	var beginGame = function()
	{
		socketio.request('mpInitialize')
		showScreen('#game-screen');
		G.load(gMaps);
		G.load(gDirections);
		properties.init()
		// maps.load(gPlaces);
	}
	var endGame = function(data)
	{
		console.log(data)
		showScreen('#lobby-screen')
	}
	var getPlaceList = function()
	{
		socketio.request('getPlaceList')
	}
	var updatePlayerList = function(list)
	{
		playerList = JSON.parse(list)
		console.log(list, playerList)
		angularjs.updatePlayerList(list)
	}
	var getPlayerList = function()
	{
		return playerList
	}

	return {
		init:function(address) 
		{
			showScreen('#start-screen')
			addButtonHandlers();
			asyncScript.fetch();
			socketio.init(address);
			angularjs.init();
			G.init();
			// beginGame(); //Temporarily added to easen testing of maps
			// monopoly.canvas = $('#gamecanvas')[0];
			// monopoly.context = monopoly.canvas.getContext('2d');
		},
		beginGame:beginGame,
		endGame:endGame,
		getPlaceList:getPlaceList,
		updatePlayerList: updatePlayerList,
		getPlayerList: getPlayerList,
	}
})();





var asyncScript = (function(){

	var fetch = function(){
		$.getScript('https://sdslabs.co.in/api/public/api.js', onScrLoad);
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

