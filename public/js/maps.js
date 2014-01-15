var maps = (function()
{
	var gmap;
	var init = function() 
	{
		google.maps.visualRefresh = true;
		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(29.86535, 77.89475)
		};
		gmap = new google.maps.Map($('#map-canvas')[0], mapOptions);
		defineBound()
		logStats()
	}

	var defineBound = function()
	{
		var allowedBounds = new google.maps.LatLngBounds(
		    new google.maps.LatLng(29.85986892392962, 77.88862466812134),
			new google.maps.LatLng(29.87304327830209, 77.90328025817871)
		);

		var lastValidCenter = gmap.getCenter();
		google.maps.event.addListener(gmap, 'center_changed', function() {
			console.log(gmap.getCenter())
		    if (allowedBounds.contains(gmap.getCenter())) {
		        lastValidCenter = gmap.getCenter();
		        return; 
		    }
		    gmap.panTo(lastValidCenter);
		});
	}

	var logStats = function()
	{
		google.maps.event.addListener(gmap, 'click', function( event ){
			console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
			console.log(gmap.getZoom())
		});
	}

	return {
		init: init
	}
})()
