module.exports = {
	name: 'NewSessionController',
	func($scope, $state, $interval, UserService, LocationService, BookService) {
		
		let haveGenre = false;
		let haveLocation = false;
		let haveDestination = false;

		/* Update user's genre selection */
		$scope.genres = BookService.getAllGenres(); // Get all book categories for dropdown menu
		
		$scope.submitGenre = () => { // Set genre after user makes selection
			UserService.setGenre($scope.selectedGenre);
			haveGenre = true;
			
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
			haveLocation = true;
		};


		/* Get user location */
		function getUserLocation() {
			// Initiate geolocation service
			let geo = navigator.geolocation;

			function geo_success(position) {
				let pos = position.coords;
				console.log(`current position: [${pos.latitude}, ${pos.longitude}]`);
				updateLocation(pos.latitude, pos.longitude);
				haveLocation = true;
				getUserDestination();
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


		/* Generate user destination */
		function getUserDestination() {
			// users < 12 yrs old will have destination of 1 mile max from current location
			let age = UserService.getUserInfo.age;
			let range;
			if (age < 12) {
				range = 1;
			} else {
				range = 3;
			}
			LocationService.setDestination(range);
			haveDestination = true;
		};
		
		
		/* Check if user gives permission to share location */
		if ("geolocation" in navigator) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}
		
		
		/* Once we have genre, user location, and destination => display map view */
		function startGame() {
			if (haveGenre && haveLocation && haveDestination) {
				stopChecking();
				$state.go('map');
			}
		};
		
		// Set interval to check if we can start game or not
		let wait;
		
		function checkForData() {
			wait = $interval(startGame, 1000);
		};
		
		function stopChecking() {
			$interval.cancel(wait);
		};
		
		checkForData();
	},
};
