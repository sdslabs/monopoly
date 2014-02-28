var monopoly = (function()
{
	var playerList = []
	var gameConstants = {}
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

		$('body').on('click', '#get-route', function() {
			graphics.promptPath(playerName, 3, {weight:2, opacity:0.9}, function(data){
				alert(JSON.stringify(data))});
		})

		$('body').on('click', '#plot-route', function() {
			graphics.drawPath(playerName, (function(){
				var str = prompt('Enter Path eg: 1 3 9');
				var _p = str.split(' ');
				for (var i=0; i<_p.length; i++)
					_p[i] = parseInt(_p[i]);
				console.log(_p);
				return _p
			})(), {weight:4, opacity: 0.9, modify:true})
			// graphics.promptPath(playerName, 3, {weight:2, opacity:0.9}, x);
		})


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
	}
	var beginGame = function()
	{
		socketio.request('mpInitialize')
		showScreen('#game-screen');
		G.load(gMaps);
		G.load(gDirections);
		loadGameData()
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

	var loadGameData = function()
	{
		$.get('/json/constants/get', function(data)
		{
			data = JSON.parse(data)
			gameConstants = data.constants
			properties.init(data.map)
			players.init()
			graphics.init();
		})
	}

	var getGameConstants = function()
	{
		return gameConstants
	}

	return {
		init:function(address) 
		{
			showScreen('#start-screen')
			addButtonHandlers();
			// asyncScript.fetch();
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
		getGameConstants: getGameConstants
	}
})();





// var asyncScript = (function(){

// 	var fetch = function(){
// 		$.getScript('https://sdslabs.co.in/api/public/api.js', onSDSLoad);
// 	}

// 	var onSDSLoad = function() {
// 		if(typeof topbar != 'undefined' && topbar != null){
// 			topbar.showTopbar();
// 		}
// 	}

// 	return {
// 		fetch: fetch
// 	}


// })();

