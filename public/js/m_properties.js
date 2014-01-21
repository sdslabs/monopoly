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
	return {
		init: init,
		getStartLocation: getStartLocation
	}
})()