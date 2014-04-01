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

	var addressFromIndex = function(index){
		var property = propertyFromIndex(index);
		return gMaps.lN({
			lat: property.location.lat,
			long: property.location.long,
		})
	}
	return {
		init: init,
		all: propertyData,
		getStartLocation: getStartLocation,
		propertyFromIndex: propertyFromIndex,
		addressFromIndex: addressFromIndex
	}
})()