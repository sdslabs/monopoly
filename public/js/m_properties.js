var properties = (function()
{
	var propertyData = {}
	var init = function()
	{
		$.get('/json/map/get', function(data)
		{
			propertyData = JSON.parse(data)
			players.init()
		})
	}
	var getStartLocation = function()
	{
		return propertyData['properties']['-1'].location;
	}
	return {
		init: init,
		getStartLocation: getStartLocation
	}
})()