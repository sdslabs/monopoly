var maps = (function()
{
	var init = function() 
	{
		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(29.86535, 77.89475)
		};
		var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
	}

	return {
		init: init
	}
})()
