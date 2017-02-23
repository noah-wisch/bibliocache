module.exports = {
	name: 'MapController',
	func($scope, $state, LocationService, BookService) {

		/*
		 * Get required data to render map (from location service)
		 * User is not directed to map view until all data is received and updated in service
		 */

		let userPos = LocationService.getUserLocation();
		let endPos = LocationService.getDestination();

		if (userPos.length === 0) {
			$state.go('new-session');
		}

		let Map, userMarker, userRadius;
		let currentPos = new google.maps.LatLng(userPos[0], userPos[1]);
		let destination = new google.maps.LatLng(endPos[0], endPos[1]);
		let destRange;
		let destRadius = 75; // in meters

		let geo = navigator.geolocation;
		let watch_id;

		/* Initiate map canvas */
		function initMap() {

			let styledMapType = new google.maps.StyledMapType(
				[{ "stylers": [{ "hue": "#16A085" }, { "saturation": 0 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }],
				{ name: 'Styled Map' }
			);

			Map = new google.maps.Map(document.querySelector('#sessionMap'), {
				zoom: 15,
				center: currentPos,
				disableDefaultUI: true,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE
				},
			});

			Map.mapTypes.set('styled_map', styledMapType);
			Map.setMapTypeId('styled_map');

			/* Remove map view buttons */
			let rendererOptions = {
				map: Map,
				suppressMarkers: true,
			};
			const directionsService = new google.maps.DirectionsService;
			const directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

			directionsDisplay.setMap(Map);
			directionsDisplay.setPanel(document.querySelector('#directions'));
			directionsDisplay.setOptions({
				polylineOptions: {
					strokeColor: '#581845',
				}
			});

			function createMarker(position, icon) {
				let marker = new google.maps.Marker({
					position: position,
					map: Map,
					icon: icon,
				});
			}

			/* Display directions */
			function calculateAndDisplayRoute(directionsService, directionsDisplay) {
				directionsService.route({
					origin: currentPos,
					destination: destination,
					travelMode: 'WALKING',
				}, (response, status) => {
					if (status === 'OK') {
						let route = response.routes[0].legs[0];
						createMarker(route.end_location, 'assets/endMarker.png');
						directionsDisplay.setDirections(response);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				});
			};
			calculateAndDisplayRoute(directionsService, directionsDisplay);

			// Set marker and radius on user's current location
			userMarker = new google.maps.Marker({
				position: currentPos,
				map: Map,
				icon: "assets/user.png",
			});

			/* Radius indicator around user */
			userRadius = new google.maps.Circle({
				strokeColor: '#581845',
				strokeOpacity: 1,
				strokeWeight: 2,
				fillColor: '#581845',
				fillOpacity: 0.4,
				map: Map,
				center: currentPos,
				radius: 50,
			});

			/* Radius indicator around destination */
			destRange = new google.maps.Circle({
				strokeColor: 'black',
				strokeOpacity: 0,
				fillColor: 'black',
				fillOpacity: 0,
				map: Map,
				center: destination,
				radius: destRadius,
			});
		};
		initMap();

		/* Watch for changes in user location */
		function watchUserPos() {

			function watch_success(pos) {
				console.log(`new position: ${pos.coords.latitude}, ${pos.coords.longitude}`);

				// Update currentPos coordinates, and rerender user on map
				currentPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				userMarker.setPosition(currentPos);
				userRadius.setCenter(currentPos);

				// Get bounds of destination (destRange includes 50m radius around destination)
				let destBounds = destRange.getBounds();
				// Determine if user's distance from target is within range
				let userInRange = google.maps.geometry.spherical.computeDistanceBetween(destination, currentPos) <= destRadius;

				// console.log(userInRange);
				if (userInRange) { // User has arrived at destination
					geo.clearWatch(watch_id);
					$state.go('end-session');
				}
			};

			function watch_error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
			}

			let watch_options = {
				enableHighAccuracy: true,
				maximumAge: 3000, // time between readings, in ms
				timeout: 5000,
			};

			/* Start watching user position */
			if (navigator.geolocation) {
				watch_id = geo.watchPosition(watch_success, watch_error, watch_options);
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