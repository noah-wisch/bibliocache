module.exports = {
	name: 'NewSessionController',
	func($scope, LocationService, BookService) {

		/* Get book info (all genre options) */
		$scope.genres = BookService.getAllGenres();

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
		};
		
		
		/* Define boudaries of app, only available to users in Charlotte, NC */
		//let cityCenter = [35.2271, -80.8431];
		
		/*let CharlotteMap = new google.maps.Map(document.querySelector('#charlotteMap'), {
			zoom: 15,
			center: [35.2271, -80.8431],
		});*/
		
		/*let circle = new google.maps.Circle({
			map: Charlotte_Map,
			center: cityCenter,
			radius: 1000,
			// metres
			//radius: 100000,
		});*/
		// Attach circle to marker
		/*circle.bindTo('center', markerCenter, 'position');
		// Get the bounds
		var bounds = circle.getBounds();
		console.log(bounds.contains(latLngA));*/
		
		
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
			
			// users < 12 yrs old will have destination < 1 mile from current location
			updateDestination(range);
		};
		
		
		/* Check if user gives permission to share location */
		if ("geolocation" in navigator) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}
	},
};
