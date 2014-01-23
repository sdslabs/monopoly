var graphics = (function(){

	var oms, objs, colors;

	var init = function() {
		oms =  new OverlappingMarkerSpiderfier(gMaps.Map());
		colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink'];
		objs = {};
	}

	var updateAll = function() {
		var i = 0;
		for (var key in players.all){
			objs[key] = {};
			objs[key].color = colors[i++];
			objs[key].player = players.all[key];
			if(objs[key].marker){
				objs[key].marker.setMap(null);
				delete objs[key].marker;
			}
			objs[key].marker = gMaps.addMarkerAt({
				latLng: objs[key].player.location,
				color: objs[key].color,
				cap: key 
			});
			oms.addMarker(objs[key].marker);
		}
		console.log(objs)
	}

	//draw everyone

	//

	//move event enemy

	// move 


	return {
		init:init,
		updateAll:updateAll
	}
} ) ();