var graphics = (function(){

	var oms;

	var init = function() {
		oms =  new OverlappingMarkerSpiderfier(gMaps.Map());
		var colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink'];
		var i = 0;
		for (var key in players.all){ 
			players.all[key].color = colors[i++];
			players.all[key].marker = null;
		}
		console.log('a', players.all)
	}

	var _update_marker = function(key) {
		if(players.all[key].marker){
				oms.removeMarker(players.all[key].marker)
				players.all[key].marker.setMap(null);
				delete players.all[key].marker;
		}
		players.all[key].marker = gMaps.addMarkerAt({
			latLng: players.all[key].location,
			color: players.all[key].color,
			cap: key 
		});
		oms.addMarker(players.all[key].marker);
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

	var drawPath = function(key, path) {
		
	}

	return {
		init:init,
		update:update
	}
} ) ();