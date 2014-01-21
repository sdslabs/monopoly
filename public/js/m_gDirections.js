var gDirections = (function(){

	var directionsService;

	function init(map) {	
		directionsService = new google.maps.DirectionsService();
	}

	function drawRoute(origin, destination, color, opacity, weight ) {
		var request = {
			origin:origin,
			destination:destination,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				var line = gMaps.getPath(null, {
					color:color, 
					opacity:opacity,
					weight:weight
				});
	
			directionsDisplay = new google.maps.DirectionsRenderer({polylineOptions: line}); 
				directionsDisplay.setMap(gMaps.Map());
				directionsDisplay.setDirections(result);
				return directionsDisplay;
   			 }else
   			 	return null;
		});
	}

	return {
		init:init,
		drawRoute:drawRoute
	}
})();