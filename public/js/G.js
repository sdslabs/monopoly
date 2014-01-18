var G = (function()
{
	var uponLoad = function()
	{
		console.log(1)
		gMaps.init()
		gPlaces.init()
		monopoly.getPlaceList()
	}	
	return {
	init: function() 
		{
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&v=3.exp&sensor=false&callback=G.uponLoad';
			document.body.appendChild(script);
		},
	uponLoad: uponLoad
	}
})();