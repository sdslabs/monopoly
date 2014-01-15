var G = (function(){

	var map;

	function initialize() {
		var mapOptions = {
			zoom: 4,
			center: new google.maps.LatLng(29.86535, 77.89475)
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
							mapOptions);
		return M;
	}

	function addMarkerCenter() {
		  var marker = new google.maps.Marker({
			position: map.getCenter(),
			map: map,
			title: 'Click to zoom'
  		});
	}

	function addMarkerAt(latlng, cap) {
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: cap
  		});
	}

	function addListener(type, action) {
		 google.maps.event.addListener(map, type, action);
	}

	function getLocation(lat, lng){
		return new google.maps.LatLng(lat, lng);
	}

	function getMap(){
		return map;
	}

	return {
		M:getMap,
		init:initialize,
		addMarkerCenter:addMarkerCenter,
		addMarkerAt:addMarkerAt,
		addListener:addListener,
		getLocation:getLocation

	}
})();


// Testing functions
function clickListener() {
	G.addListener('click', function(event){
		G.addMarkerAt(event.latLng, prompt("Marker Tag?"));
	});

}
