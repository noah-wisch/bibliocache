module.exports = {
	name: 'NewSessionController',
	func($scope, LocationService, BookService) {

		$scope.genres = BookService.getAllGenres();
		console.log($scope.genres);

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
		};

		let allowLocation = "geolocation" in navigator;

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

		// If user's location is available
		if (allowLocation) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}

		function updateLocation(lat, lng) {
			LocationService.updateUserLocation(lat, lng);
		};
	},
};
