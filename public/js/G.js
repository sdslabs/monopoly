var G = (function()
{
	var Ready =  false;

	var ready = function(){
		return Ready;
	}

	var uponLoad = function()
	{
		console.log(1)
		Ready = true;
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
	uponLoad: uponLoad,
	ready: ready
	}
})();