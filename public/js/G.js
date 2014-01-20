var G = (function()
{
	var count = 0, Ready =  false ,_callback = {};

	var ready = function(){
		return Ready;
	}

	var uponLoad = function()
	{
		Ready = true;
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

	function execute_callback(){
		uponLoad();
		if(_callback.callback){
			if(_callback.args)
				_callback.callback(_callback.args);
			else
				_callback.callback();
		}
	}

	return {
	init: function(callback, args) 
		{
			_callback.callback = callback;
			_callback.args = args;
			// if(!callback)
			// 	callback = 'G.uponLoad'
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&v=3.exp&sensor=false&callback=G.execute_callback'
			document.body.appendChild(script);
		},
	load:load,
	uponLoad: uponLoad,
	execute_callback:execute_callback,
	ready: ready
	}
})();