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

	var update = function() {
		for (var key in players.all){
			if(players.all[key].marker){
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
		console.log('b', players.all)
	}

	//draw everyone

	//

	//move event enemy

	// move 


	return {
		init:init,
		update:update
	}
} ) ();