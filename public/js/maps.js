var graphics = (function(){

	var map;

	function initialize() {
		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(29.86535, 77.89475)
		};
		map = new google.maps.Map(document.getElementById('map-canvas'),
							mapOptions);
		return M;
	}

	function setMarkerCenter() {
		  var marker = new google.maps.Marker({
			position: map.getCenter(),
			map: map,
			title: 'Click to zoom'
  		});
	}

	function setMarkerAt(lat, lng, title) {
		var pos = new google.maps.LatLng(lat, lng);
		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			title: title
  		});
	}
	return {
		init:initialize,
		setMarkerCenter:setMarkerCenter,
		setMarkerAt:setMarkerAt

	}
})();
