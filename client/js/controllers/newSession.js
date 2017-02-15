module.exports = {
	name: 'NewSessionController',
	func($scope, $state, UserService, LocationService, BookService) {

		/* Get book info (all genre options) */
		$scope.genres = BookService.getAllGenres();

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
		};
		
		
		/* Update user location */
		function updateLocation(lat, lng) {
			LocationService.updateUserLocation(lat, lng);
		};

		
		/* Get user location */
		function getUserLocation() {
			// Initiate geolocation service
			let geo = navigator.geolocation;

			function geo_success(position) {
				let pos = position.coords;
				console.log(`current position: [${pos.latitude}, ${pos.longitude}]`);
				updateLocation(pos.latitude, pos.longitude);
			};

			function geo_error(err) {
				console.warn(`ERROR(${err.code}): ${err.message}`);
			};

			let geo_options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

			geo.getCurrentPosition(geo_success, geo_error, geo_options);
		};
		
		
		/* Update user destination */
		function updateDestination(range) {
			LocationService.updateUserDestination(range);
		};
		
		
		/* Get user destination */
		function getUserDestination() {
			// 1 mi = approximately 0.015 deg (lat and lng)
			
			// users < 12 yrs old will have destination < 1 mile from current location
			let age = UserService.
			if ()
			updateDestination(range);
		};
		
		
		/* Check if user gives permission to share location */
		if ("geolocation" in navigator) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}
		
		
		/* Once we have genre, user location, and destination => display map view */
		// $state.go('map');
	},
};
