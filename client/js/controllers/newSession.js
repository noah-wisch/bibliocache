module.exports = {
	name: 'NewSessionController',
	func($scope, LocationService, BookService) {

		// Get book info (all genre options)
		$scope.genres = BookService.getAllGenres();
		console.log($scope.genres);

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
		};

		// Get user location info
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

		// If user gives permission to share location
		if ("geolocation" in navigator) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}

		function updateLocation(lat, lng) {
			LocationService.updateUserLocation(lat, lng);
		};
	},
};
