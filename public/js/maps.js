function initialize() {
	var mapOptions = {
		zoom: 15,
		center: new google.maps.LatLng(29.86535, 77.89475)
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
						mapOptions);
}
