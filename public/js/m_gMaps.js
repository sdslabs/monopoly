var gMaps = (function(){

	var map;
	var allowedBounds;

	function initialize() {

		google.maps.visualRefresh = true;
		var mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng(29.86535, 77.89475),
			panControl: true,
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			overviewMapControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		};

		map = new google.maps.Map(document.getElementById('map-canvas'),
							mapOptions);

		$('#map-canvas').height($(window).height());
		$('#map-canvas').width($(window).width());

		defineBound();
		initResizeHandler();
		// logStats();
		gPlaces.init()
		  
		return map;
	}


	var defineBound = function() {
		allowedBounds = new google.maps.LatLngBounds(
		    new google.maps.LatLng(29.85986892392962, 77.88862466812134),
			new google.maps.LatLng(29.87304327830209, 77.90328025817871)
		);

		var lastValidCenter = map.getCenter();
		google.maps.event.addListener(map, 'center_changed', function() {
			console.log(map.getCenter())
		    if (allowedBounds.contains(map.getCenter())) {
		        lastValidCenter = map.getCenter();
		        return; 
		    }
		    map.panTo(lastValidCenter);
		});
	}

	// Internal function
	function getIconURL(color) {
		if(color != null && color != '')
			return '/images/icons/'+ color + '-dot.png'
		else
			return '/images/icons/red-dot.png'
	}

	var initResizeHandler = function()
	{
		$(window).resize(function(){
	        $('#map_canvas').css("height",$(window).height());
	        $('#map_canvas').css("width",$(window).width());
	        google.maps.event.trigger(map, 'resize');
	        map.setZoom( map.getZoom() );
	        console.log('map resized')
		});
	}

	var logStats = function()
	{
		google.maps.event.addListener(map, 'click', function( event ){
			console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
			console.log(map.getZoom())
		});
	}

	// options - latLng, cap, color (optional)

	function addMarkerAt(options) {

		var marker = new google.maps.Marker({
			icon: getIconURL(options.color),
			position: options.latLng,
			map: map,
			title: options.cap,
			animation: google.maps.Animation.DROP
  		});
  		return marker;
	}

	
	// options - cap, size (optional)
	function getInfoWindow(options) {
		var size = options.size || 50;
		var infowindow = new google.maps.InfoWindow({
			content: options.cap,
			size: new google.maps.Size(size, size)
		});
		// infowindow.open(map, marker);
		return infowindow;
	}

	// draws a line
	// options - latLngList (array of latLng to plot)
	//           obj(JSON, optional) - color, opacity, weight 
	function getPath(options) {	
		var obj = options.obj;
		if(!obj.color)
			obj.color = '#000000';
		
		if(!obj.opacity)
			obj.opacity = 1.0;
		
		if(!obj.weight)
			obj.weight = 2;

		var _options = {
   				geodesic: true,
    			strokeColor: obj.color,
    			strokeOpacity: obj.opacity,
    			strokeWeight: obj.weight,
 		 	}

 		if(options.latLngList)
 			_options.path = options.latLngList;

		var line = new google.maps.Polyline(_options);
 	 	return line;
	}

	function addListener(type, action) {
		google.maps.event.addListener(map, type, action);
	}

	function addListenerOth(obj, type, action) {
		google.maps.event.addListener(obj, type, action);
	}	

	function getLocation(lat, lng){
		return new google.maps.LatLng(lat, lng);
	}

	function getBounds()
	{
		return allowedBounds;
	}

	function Map(){
		console.log(map);
		return map;
	}

	return {
		Map:Map,
		init:initialize,
		// addMarkerCenter:addMarkerCenter,
		addMarkerAt:addMarkerAt,
		addMarkerImage:addMarkerImage,
		addListener:addListener,
		addListenerOth:addListenerOth,
		getInfoWindow:getInfoWindow,
		getPath:getPath,
		getLocation:getLocation,
		getBounds:getBounds

	}
})()