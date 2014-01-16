// var maps = (function()
// {
// 	var gmap;
	// var init = function() 
	// {
	// 	google.maps.visualRefresh = true;
	// 	var mapOptions = {
	// 		zoom: 15,
	// 		center: new google.maps.LatLng(29.86535, 77.89475)
	// 	};
	// 	gmap = new google.maps.Map($('#map-canvas')[0], mapOptions);
	// 	defineBound()
	// 	logStats()
	// }

	// var defineBound = function()
	// {
	// 	var allowedBounds = new google.maps.LatLngBounds(
	// 	    new google.maps.LatLng(29.85986892392962, 77.88862466812134),
	// 		new google.maps.LatLng(29.87304327830209, 77.90328025817871)
	// 	);

	// 	var lastValidCenter = gmap.getCenter();
	// 	google.maps.event.addListener(gmap, 'center_changed', function() {
	// 		console.log(gmap.getCenter())
	// 	    if (allowedBounds.contains(gmap.getCenter())) {
	// 	        lastValidCenter = gmap.getCenter();
	// 	        return; 
	// 	    }
	// 	    gmap.panTo(lastValidCenter);
	// 	});
	// }

// 	var logStats = function()
// 	{
// 		google.maps.event.addListener(gmap, 'click', function( event ){
// 			console.log( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
// 			console.log(gmap.getZoom())
// 		});
// 	}

// 	return {
// 		init: init
// 	}
// })()
var gMaps = (function(){

	var map;

	function initialize() {
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

// Stylers at: https://developers.google.com/maps/documentation/javascript/styling

		map = new google.maps.Map(document.getElementById('map-canvas'),
							mapOptions);
		defineBound();
		logStats();
		return map;
	}

	var defineBound = function() {
		var allowedBounds = new google.maps.LatLngBounds(
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

	function getMap(){
		return map;
	}

	return {
		M:getMap,
		init:initialize,
		addMarkerCenter:addMarkerCenter,
		addMarkerAt:addMarkerAt,
		addMarkerImage:addMarkerImage,
		addListener:addListener,
		addListenerOth:addListenerOth,
		addInfoWindow:addInfoWindow,
		addPath:addPath,
		getLocation:getLocation

	}
})();


// Testing functions
var latLngList = [];
var path;
function clickListener() {
	gMaps.addListener('click', function(event){
		
		latLngList.push(event.latLng);
		gMaps.addMarkerAt(event.latLng, "Location "+latLngList.length);
		console.log("POINT "+ latLngList.length);
		if(latLngList.length == 4){
			path = gMaps.addPath(latLngList);
			latLngList = [];
			// setTimeout(function(){path.setMap(null)}, 3000);
		}
	});

}
