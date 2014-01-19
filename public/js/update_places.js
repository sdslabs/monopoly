var updatePlaces = (function()
{
	var placeList;
	var placeInfo = {}

	var searchPlaces = function()
	{
		gMaps.init()
		for(var key in placeList)
		{
			var place = placeList[key]
			gPlaces.placeSearch(place, (function(_place)
			{
				return function(results, status)
				{
					if(results.length)
						placeInfo[_place] = {'location':{'lat':results[0].geometry.location.d, 'long':results[0].geometry.location.e},
											 'name':results[0].name};
				}
			})(place))
		}
	}

	return {
		init: function(places)
		{
			placeList = places
			G.init('updatePlaces.searchPlaces')
		},

		searchPlaces:searchPlaces,
		show:function()
		{
			console.log(placeInfo)
		}
	}
})()