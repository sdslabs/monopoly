var graphics = (function(){

	var oms;

	function colourNameToHex(colour){
		var colours = {
			"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
			"beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
			"cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
			"darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
			"darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
			"darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
			"firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
			"gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
			"honeydew":"#f0fff0","hotpink":"#ff69b4",
			"indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
			"lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
			"lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
			"lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
			"magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
			"mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
			"navajowhite":"#ffdead","navy":"#000080",
			"oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
			"palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
			"red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
			"saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
			"tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
			"violet":"#ee82ee",
			"wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
			"yellow":"#ffff00","yellowgreen":"#9acd32"
		};

    	if (typeof colours[colour.toLowerCase()] != 'undefined')
    		return colours[colour.toLowerCase()];

    	return false;
	}

	var init = function() {
		console.log('initialized graphics...');
		oms =  new OverlappingMarkerSpiderfier(gMaps.Map());
		var colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink'];
		var i = 0;
		for (var key in players.all){ 
			players.all[key].color = colors[i++];
			players.all[key].marker = null;
		}
	}

	function _addMarkerAt(options) {
		var marker = gMaps.addMarkerAt(options);
		marker._infoWindow = gMaps.getInfoWindow({
			cap: marker.getTitle(),
			marker: marker
		});
		oms.addMarker(marker);
		return marker;
	}

	function _removeMarker(marker) {
		google.maps.event.clearInstanceListeners(marker);
		marker.setMap(null);
		marker._infoWindow.close();
		oms.removeMarker(marker);
	}

	var _update_marker = function(key, options) {
		options = options || {};
		// console.log('Updating marker for '+key);
		if(players.all[key].marker){
			_removeMarker(players.all[key].marker);
			delete players.all[key].marker;
		}
		if(players.all[key].markerE){
			_removeMarker(players.all[key].markerE);
			delete players.all[key].markerE;
		}
		if(!options.clear){
			players.all[key].marker = _addMarkerAt({
				latLng: players.all[key].location,
				color: players.all[key].color,
				cap: options.cap || key
			});
		}
	}


	// Updates all markers to their latest positions when no key is give
	// Otherwise, updates the marker for the given key
	var update = function(key) {
		if(!key || key == '')
			for (var key in players.all)
				_update_marker(key);
		else
			_update_marker(key);

	}

	/* Draws a path from current positon + the path passed in path array
		path - array containing properties (addressed by indices)
		eg: drawPath('playerName', [0, 2, 9], options)

		options.weight sets the line weight
		options.opacity sets the line opacity

	   Markers are added at the start and end of the resulting path.
	*/
	var drawPath = function(key, path, options) {
		var _path = [];
		options = options || {};

		if(options.modify){
			if(!players.all[key].marker){
				options.cap = properties.propertyFromIndex(
					players.all[key].getCurrentPropByIndex()).id;
				_update_marker(key, options);
			}
			_path.push(players.all[key].marker.getPosition());
		}

		for(var i =0; i < path.length; i++)
			_path.push(properties.addressFromIndex(path[i]))

		var color = colourNameToHex(players.all[key].color);
		players.all[key].route = [];

		var _asyncUpdate =function(value) {
			players.all[key].route.push(value);
		}	

		for(var i = 0; i<_path.length-1; i++){
			gDirections.drawRoute({
				origin: _path[i],
				dest: _path[i+1],
				color: color,
				weight: options.weight,
				opacity: options.opacity,
				suppressMarkers: true
			}, _asyncUpdate);
		}
		console.log(_path)
		// gMaps.panTo(gMaps.lN(properties.propertyFromIndex(
		// 		_path[_path.length-1]).location
		// 	));
				

		if(options.modify){
			players.all[key].markerE = _addMarkerAt({
				latLng: _path[_path.length-1],
				color: players.all[key].color,
				cap: properties.propertyFromIndex(path[path.length-1]).id || key 
			});
		}
	}

	// Clears a path drawn using drawPath()
	// Set options.clear to true to remove every marker. Else the starting marker is updated to with the current position.
	var clearPath = function(key, options) {
		if(players.all[key].route){
			var route = players.all[key].route
			for(var i =0; i<route.length; i++)
				route[i].setMap(null);
		}

		delete players.all[key].route;
		_update_marker(key, options);
	}

	/*
		Interactively queries a player for a path and return the route (array containing
		property indices)

		Call graphics.promptPath

		_key - player name
		_turns - turns to scan for
		_options - options for lines drawn with draw route
		_callback - exectues when a complete path is generated, or the player times out

		set INTERNAL variable CONST for prompt Route to set constant values
			- OK - status code for correct path
			- TIMEOUT - status code when timeout executes
			- TIMEOUT_INTV - Time out for callback execution (in ms)
	*/
	var promptRoute = (function(){

		var _path = [];
		var turns = 0;
		var key = 0;
		var player = null;
		var options = {};
		var _markers = null;
		var callback = null;
		var elapsedTurns = 0;
		var _curPropIndex = 0;

		const CONST = {
			'OK': 0,
			'NO_CHOICE': 1,
			'TIMEOUT': 2,
			'TIMEOUT_INTV': 7777000,
		};

		function update(choice) {

			_path.push(''+choice);
			if(elapsedTurns < turns){
				if(choice == CONST.NO_CHOICE)
					_curPropIndex = 1;
				else
					_curPropIndex = choice;
				_promptPath(_curPropIndex);
				elapsedTurns++;

			}else
				_return(CONST.OK);
		}

		function _return (_status) {
			if(_markers){
				_removeMarker(_markers.begin);
				for(var k=0; k<_markers.ends.length; k++)
					_removeMarker(_markers.ends[k]);
				delete _markers;
			}
			clearPath(key, {
					clear: true,
					modify: false
				});

			callback({
				status: _status,
				route: _status == CONST.OK ? _path : null 
			});
		}

		function begin(_key, _turns, _options, _callback) {
			key = _key
			turns = _turns;
			options = _options || {};
			callback = _callback; 

			if(!players.all[key].marker)
				_update_marker(key);

			player = players.all[key];

			setTimeout(function(){
					_return(CONST.TIMEOUT);
				}, 
				CONST.TIMEOUT_INTV);
			update(CONST.NO_CHOICE);
		}

		function _promptPath (curPropIndex) {
			clearPath(key, {
					clear: true,
					modify: false
				});

			var curProp = properties.propertyFromIndex(curPropIndex);
			var ends = curProp.paths;
			
			var markers = {};

			markers.begin = _addMarkerAt({
					latLng: gMaps.lN(curProp.location),
					color: player.color,
					cap: 'Current Position (' + curProp.id + ')' 
				});

			markers.ends = [];

			for(var j=0; j<ends.length; j++){
				var path = [];
				var property = properties.propertyFromIndex(ends[j]);

				path.push(curPropIndex);
				path.push(ends[j]);

				markers.ends.push(_addMarkerAt({
					latLng: gMaps.lN(property.location),
					color: player.color,
					cap: j+1 + ': ' + property.id
				}));

				drawPath(key, path, {
					clear: true,
					modify: false,
					weight: options.weight,
					opacity: options.opacity
				});

				gMaps.addListenerOth({
					obj: markers.ends[j],
					type: 'click',
					action: (function(_markers, i)
						{
							var _update = function(){
								_removeMarker(markers.begin);
								for(var k=0; k<_markers.ends.length; k++)
									_removeMarker(markers.ends[k]);
								update(ends[i]);	
							}							
							return _update;
						})(markers, j)
				});
			}
			_markers = markers;
		}

		return {
			begin: begin
		}

	})();

	return {
		init:init,
		rm: _removeMarker,
		update:update,
		promptPath: promptRoute.begin,
		drawPath:drawPath,
		clearPath:clearPath
	}
} ) ();