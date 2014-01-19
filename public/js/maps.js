var gMaps = (function(){

	var map;
	var count = 0;
	var allowedBounds;

	function initialize() {
		if(!G.ready()){
			if(count++ < 15){
				setTimeout(initialize, 500);
				console.log("Google Maps not loaded yet...")
			}else
				console.log("Failed to load map");
			return null;
		}
		google.maps.visualRefresh = true;
		var mapOptions = {
			zoom: 17,
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

		$('#map-canvas').height($("#game-screen").height());
		$('#map-canvas').width($("#game-screen").width());

		defineBound();
		logStats();
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

	var logStats = function()
	{
		google.maps.event.addListener(map, 'click', function( event ){
			console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
			console.log(map.getZoom())
		});
	}

	function addMarkerCenter() {
		  var marker = new google.maps.Marker({
			position: map.getCenter(),
			map: map,
			title: 'Click to zoom'
  		});
		return marker;
	}

	function addMarkerAt(latLng, cap) {
		var marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: cap
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
			title: cap
  		});

  		return marker;
	}

	function addInfoWindow(marker, cap) {
		var infowindow = new google.maps.InfoWindow({
			content: cap,
			size: new google.maps.Size(50,50)
		});
		infowindow.open(map, marker);
		return infowindow;
	}

	function addPath(latLngList, color) {
		if(color == null)
			color = '#000000';
		var line = new google.maps.Polyline({
    			path: latLngList,
   				geodesic: true,
    			strokeColor: color,
    			strokeOpacity: 1.0,
    			strokeWeight: 2,
 		 });

 	 	line.setMap(map);

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

	function getMap(){
		return map;
	}

	return {
		getMap:getMap,
		// ready:ready,
		init:initialize,
		addMarkerCenter:addMarkerCenter,
		addMarkerAt:addMarkerAt,
		addMarkerImage:addMarkerImage,
		addListener:addListener,
		addListenerOth:addListenerOth,
		addInfoWindow:addInfoWindow,
		addPath:addPath,
		getLocation:getLocation,
		getBounds:getBounds

	}
})();

var gPlaces = (function()
{
	var count = 0, placesService;
	var init = function()
	{
		if(!G.ready()){
			if(count++ < 15){
				setTimeout(initialize, 500);
				console.log("Google Maps not loaded yet...")
			}else
				console.log("Failed to load map");
			return null;
		}
		placesService = new google.maps.places.PlacesService(gMaps.getMap());
		
	}

	var placeSearch = function(search)
	{
		var request = {
			'bounds': gMaps.getBounds(), //The bounds within which to search for Places
			'keyword': search
		};
		  placesService.nearbySearch(request, function(results, status){
		  	console.log(results, status)
		  	if(results.length > 0)
			  	gMaps.addMarkerAt(results[0].geometry.location)
		    else
		    	console.log(search)

			});	
	}
	var setPlaceList = function(placeList)
	{
		placeList = JSON.parse(placeList)
		for(var key in placeList)
		{
			var place = placeList[key]
			placeSearch(place)
		}
	}

	return {
		init:init,
		placeSearch:placeSearch,
		setPlaceList:setPlaceList
	}
})();