module.exports = {
	name: 'NewSessionController',
	func($scope, LocationService, BookService) {

		/* Get book info (all genre options) */
		$scope.genres = BookService.getAllGenres();

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
		};
		
		
		/* Define boudaries of app, only available to users in Charlotte, NC */
		let CharlotteMap;
		
		function initCltMap() {
			let mapOptions = {
				zoom: 10,
				center: new google.maps.LatLng(35.2271, -80.8431),
			};
			CharlotteMap = new google.maps.Map(document.querySelector('#charlotteMap'), mapOptions);

			let gameArea = new google.maps.Polygon({
				paths: [
					new google.maps.LatLng(35.281343, -80.948365),
					new google.maps.LatLng(35.283585, -80.731385),
					new google.maps.LatLng(35.145582, -80.746492),
					new google.maps.LatLng(35.134352, -80.925019),
				]
			});
			
			google.maps.event.addListener(CharlotteMap, 'click', function(event) {
				console.log(google.maps.geometry.poly.containsLocation(event.latLng, gameArea));
			});
		}

		google.maps.event.addDomListener(window, 'load', initCltMap);
		
		
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
