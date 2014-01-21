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

	// function addMarkerCenter(options) {
		  
	// 	  var marker = new google.maps.Marker({
	// 		icon: getIconURL(options.color),
	// 		position: map.getCenter(),
	// 		map: map,
	// 		title: 'Click to zoom',
	// 		animation: google.maps.Animation.DROP
 //  		});
	// 	return marker;
	// }

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

	function addMarkerImage(latLng, image_url, shadow_url, cap){
		var image = new google.maps.MarkerImage(image_url,
      					new google.maps.Size(20, 32),
      					new google.maps.Point(0,0),
     					new google.maps.Point(0, 32));
		var shadow = null;
		if(shadow_url)
			shadow = new google.maps.MarkerImage(shadow_url,
						new google.maps.Size(37, 32),
      					new google.maps.Point(0,0),
      					new google.maps.Point(0, 32));
		var marker = new google.maps.Marker({
			position: latLng,
			map: map,
			icon:image,
			shadow:shadow,
			title: cap,
			animation: google.maps.Animation.DROP
  		});

  		return marker;
	}

	function getInfoWindow(marker, cap) {
		var infowindow = new google.maps.InfoWindow({
			content: cap,
			size: new google.maps.Size(50,50)
		});
		// infowindow.open(map, marker);
		return infowindow;
	}

	function getPath(latLngList, obj) {	
		if(!obj.color)
			obj.color = '#000000';
		
		if(!obj.opacity)
			obj.opacity = 1.0;
		
		if(!obj.weight)
			obj.weight = 2;

		var options = {
   				geodesic: true,
    			strokeColor: obj.color,
    			strokeOpacity: obj.opacity,
    			strokeWeight: obj.weight,
 		 	}

 		if(latLngList)
 			options.path = latLngList;

		var line = new google.maps.Polyline(options);
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