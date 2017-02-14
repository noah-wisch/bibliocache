module.exports = {
    name: 'MapController',
    func($scope, LocationService) {
		
		/* Get required data to render map */
		let location = LocationService.getUserLocation();
		if (location === undefined) {
			console.log('location not defined');
		}
		
		let Map, Street;
		let currentPos = { // 'currentPos' object is defined with 'location' array elements
			lat: location[0],
			lng: location[1],
		};
		let destination = {
			lat: 35.226143,
			lng: -80.852892,
		};
		
		let geo = navigator.geolocation;
		
		
		function initMap() {
			Map = new google.maps.Map(document.querySelector('#sessionMap'), {
				zoom: 15,
				center: currentPos,
			});
			
			// Set marker and radius on user's current location
			let userMarker = new google.maps.Marker({
				position: currentPos,
				map: Map,
				icon: "assets/user.png",
			});
			let userRadius = new google.maps.Circle({
				strokeColor: '#FF1990',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: Map,
				center: currentPos,
				radius: 200,
			});
			/*GeoMarker = new BlueDot.GeolocationMarker();
			GeoMarker.setCircleOptions({fillColor: '#808080'});
			google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
				Map.setCenter(this.getPosition());
				Map.fitBounds(this.getBounds());
			});
			google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
				alert('There was an error obtaining your position. Message: ' + e.message);
			});
			GeoMarker.setMap(Map);*/
			
			// Set marker on destination
			let destMarker = new google.maps.Marker({
				position: destination,
				map: Map,
				icon: "assets/marker.png",
			});
			
			// Set street view
			Street = new google.maps.StreetViewPanorama(
			document.querySelector('#sessionPano'), {
				position: currentPos,
				pov: {
					heading: 34,
					pitch: 10
				}
			});
			Map.setStreetView(Street);
			
		};
		initMap();
		
		function watchUserPos() {
			
			function watch_success(pos) {
				console.log(pos.coords.latitude + ', ' + pos.coords.longitude);
				
				if (destination.lat === pos.lat && destination.lng === pos.lng) {
					console.log('Congratulations, you reached the cache');
					geo.clearWatch(watch_id);
				}
			};
			
			function watch_error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
			}
			
			let watch_options = {
				enableHighAccuracy: true,
				//timeout: 5000,
				//maximumAge: 0
			};
			
			// Start watching user position
			if (navigator.geolocation) {
				let watch_id = navigator.geolocation.watchPosition(watch_success, watch_error, watch_options);
			} else {
				console.log('error');
			}
			
		};
		
		
		/* Check if user gives permission to share location */
		if ("geolocation" in navigator) {
			watchUserPos();
		} else {
			alert("Geolocation services are not supported by your browser."); 
		}
		
		
		/* Get directions to destination */
		//LocationService.getDirections();
		
	},
};