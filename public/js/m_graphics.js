var graphics = (function(){

	var oms;

	var init = function() {
		oms =  new OverlappingMarkerSpiderfier(gMaps.Map());
		
		var markers = []
		markers.push(gMaps.addMarkerAt({
			latLng: gMaps.Map().getCenter(),
			cap: "1",
			color: "red"
		}))

		markers.push(gMaps.addMarkerAt({
			latLng: gMaps.Map().getCenter(),
			cap: "2",
			color: "blue"
		}))

		markers.push(gMaps.addMarkerAt({
			latLng: gMaps.Map().getCenter(),
			cap: "3",
			color: "green"
		}))

var iw = new gm.InfoWindow();
		oms.addListener('click', function(marker, event) {
  iw.setContent(marker.desc);
  iw.open(map, marker);
});

		for (var i =0 ; i<markers.length; i++)
			oms.addMarker(markers[i])
	}

	//draw everyone

	//

	//move event enemy

	// move 


	return {
		init:init
	}
} ) ();