var updatePlaces = (function()
{
	var placeList;
	var placeInfo = {}
	var dom_obj;

	var searchPlaces = function()
	{
		gMaps.init()
		var requestCount = 0

		for(var key in placeList)
		{
			var place = placeList[key]
			gPlaces.placeSearch(place, (function(_place)
			{
				return function(results, status)
				{
					if(results.length)
						placeInfo[_place] = {'location':{'lat':results[0].geometry.location.d, 'long':results[0].geometry.location.e},
											 'id':results[0].name};
					if(++requestCount >= placeList.length)
						sendUpdateRequest()
					console.log(requestCount, placeList.length)
				}
			})(place))
		}
	}

	var sendUpdateRequest = function()
	{
		console.log(placeInfo)
		$.ajax({
			type:'POST',
			url:'/json/map/update',
			data:placeInfo,

		}).done(function(data){
				dom_obj.html(data);
			})
	}
	return {
		init: function(places, object)
		{
			placeList = places
			dom_obj = object
			G.init(updatePlaces.searchPlaces)
		},

		searchPlaces:searchPlaces,
		show:function()
		{
			console.log(placeInfo)
		}
	}
})()