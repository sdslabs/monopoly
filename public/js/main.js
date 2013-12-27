var monopoly = (function()
{
	var showScreen = function(id) 
	{
		$('.game-layer').hide()
		$(id).show()
	};
	var addButtonHandlers = function()
	{
		$('#start-btn').click('lobby-screen', showScreen);
	};

	return {
		init:function() 
		{
			$('.game-layer').hide();
			$('#start-screen').show();
			addButtonHandlers();
			socketio.init();
			// monopoly.canvas = $('#gamecanvas')[0];
			// monopoly.context = monopoly.canvas.getContext('2d');
		},
	}
})();

var socketio = (function()
{
	// var socket;

	var init = function()
	{	
		socket = io.connect('http://localhost:8080');
		socket.on('connect', onConnect);
		socket.on('addNewPlayerSuccess', addNewPlayerSuccess); 
		console.log('bound');
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
		console.log(22)
		setCookie('playerName', playerName, 1);	
	};

	return {
		init: init
	}
})();
