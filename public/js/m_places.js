var gPlaces = (function()
{
    var placesService;
	var init = function()
	{
		placesService = new google.maps.places.PlacesService(gMaps.Map());
		
	}

	var placeSearch = function(search, callback)
	{
		var request = {
			'bounds': gMaps.getBounds(), //The bounds within which to search for Places
			'keyword': search
		};
		if(callback)
			placesService.nearbySearch(request, callback)
		else
			placesService.nearbySearch(request, function(results, status){
			  	if(results.length > 0)
			  		return results[0]
				  	// gMaps.addMarkerAt(results[0].geometry.location)
			    else
			    	return 0
			});	
	}
	var setPlaceList = function(placeList)
	{
		placeList = JSON.parse(placeList)
		for(var key in placeList)
		{
			var place = placeList[key]
			placeSearch(place)
		}
	}

	return {
		init:init,
		placeSearch:placeSearch,
		setPlaceList:setPlaceList
	}
})();