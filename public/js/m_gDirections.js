var gDirections = (function(){

	var directionsService;

	function init(map) {	
		directionsService = new google.maps.DirectionsService();
	}

	function drawRoute(options) {
		var request = {
			origin:options.origin,
			destination:options.destination,
			travelMode: google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(result, status) {
			var line;
			if (status == google.maps.DirectionsStatus.OK) {
					line = gMaps.getPath(null, {
					color:options.color, 
					opacity:options.opacity,
					weight:options.weight
				});
	
				directionsDisplay = new google.maps.DirectionsRenderer(
					{polylineOptions: line}); 
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