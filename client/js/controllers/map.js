module.exports = {
	name: 'MapController',
	func($scope, LocationService) {

		/*
		 * Get required data to render map (from location service)
		 * User is not directed to map view until all data is received and updated in service
		 */ 
		let userPos = LocationService.getUserLocation();
		let endPos = LocationService.getDestination();

		let Map, Street;
		let currentPos = { // convert 'userPos' array to 'currentPos' object
			lat: userPos[0],
			lng: userPos[1],
		};
		let destination = { // convert 'endPos' array to 'destination' object
			lat: endPos[0],
			lng: endPos[1],
		};

		let geo = navigator.geolocation;


		/* Initiate map canvas */
		function initMap() {

			Map = new google.maps.Map(document.querySelector('#sessionMap'), {
				zoom: 15,
				center: currentPos,
			});

			// Display directions
			const directionsService = new google.maps.DirectionsService;
			const directionsDisplay = new google.maps.DirectionsRenderer;

			directionsDisplay.setMap(Map);
			directionsDisplay.setPanel(document.querySelector('#directions'));

			function calculateAndDisplayRoute(directionsService, directionsDisplay) {
				directionsService.route({
					origin: currentPos,
					destination: destination,
					travelMode: 'WALKING'
				}, (response, status) => {
					if (status === 'OK') {
						directionsDisplay.setDirections(response);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				});
			};
			calculateAndDisplayRoute(directionsService, directionsDisplay);

			// Set marker and radius on user's current location
			let userMarker = new google.maps.Marker({
				position: currentPos,
				map: Map,
				icon: "assets/user.png",
			});
			let userRadius = new google.maps.Circle({
				strokeColor: '#313131',
				strokeOpacity: 0.4,
				strokeWeight: 0.8,
				fillColor: '#ffffff',
				fillOpacity: 0.6,
				map: Map,
				center: currentPos,
				radius: 50,
			});
			
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
				}
			);
			Map.setStreetView(Street);
		};
		initMap();


		/* Watch for changes in user location */
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

	},
};