module.exports = {
	name: 'NewSessionController',
	func($scope, $state, UserService, LocationService, BookService) {

		/* Get book info (all genre options) */
		$scope.genres = BookService.getAllGenres();

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
			
			const ProgressBar = require('progressbar.js')
			const bar = new ProgressBar.Line(container, {
				strokeWidth: 4,
				easing: 'easeInOut',
				duration: 1400,
				color: '#FFEA82',
				trailColor: '#eee',
				trailWidth: 1,
				svgStyle: { width: '100%', height: '100%' },
				from: { color: '#FFEA82' },
				to: { color: '#ED6A5A' },
				step: (state, bar) => {
					bar.path.setAttribute('stroke', state.color);
				}
			});
			bar.animate(1.0);  // Number from 0.0 to 1.0
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
			// users < 12 yrs old will have destination of 1 mile max from current location
			let age = UserService.getUserInfo.age;
			let range;
			if (age < 12) {
				range = 1;
			} else {
				range = 3;
			}
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
