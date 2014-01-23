var properties = (function()
{
	var propertyData = {}
	var init = function(_propertyData)
	{
		propertyData = _propertyData
	}
	var getStartLocation = function()
	{
		return propertyData['properties']['-1'].location;
	}

	var propertyFromIndex = function(index)
	{
		return propertyData['properties'][index+'']
	}
	return {
		init: init,
		all: propertyData
		getStartLocation: getStartLocation,
		propertyFromIndex: propertyFromIndex
	}
})()