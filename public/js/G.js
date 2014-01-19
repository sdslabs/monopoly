var G = (function()
{
	var count = 0, Ready =  false;

	var ready = function(){
		return Ready;
	}

	var uponLoad = function()
	{
		Ready = true;
		monopoly.getPlaceList()
	}	

	function load(module){
		if(!ready()){
			if(count++ < 15){
				setTimeout(load, 500);
				console.log("Google Maps not loaded yet...")
				return false;
			}else{
				console.log("Failed to load map");
				return false;
			}
		}else{
			console.log("Loading module");
			module.init();
			return true;
		}
	}

	return {
	init: function() 
		{
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&v=3.exp&sensor=false&callback=G.uponLoad';
			document.body.appendChild(script);
		},
	load:load,
	uponLoad: uponLoad,
	ready: ready
	}
})();