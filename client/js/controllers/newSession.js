module.exports = {
	name: 'NewSessionController',
	func($scope, $state, $interval, UserService, LocationService, BookService) {

		let haveGenre = false;
		let haveLocation = false;
		let haveDestination = false;

		/* Update user's genre selection */
		$scope.genres = BookService.getAllGenres(); // Get all book categories for dropdown menu

		$scope.submitGenre = (genre) => { // Set genre after user makes selection
			UserService.setGenre(genre);
			haveGenre = true;

			const ProgressBar = require('progressbar.js')
			const bar = new ProgressBar.Line(loadingBar, {
				strokeWidth: 4,
				easing: 'easeInOut',
				duration: 5000,
				color: '#4E978A',
				trailColor: '#581845',
				trailWidth: 1,
				svgStyle: { width: '100%', height: '100%' },
				from: { color: '#A3E6D9' },
				to: { color: '#4E978A' },
				step: (state, bar) => {
					bar.path.setAttribute('stroke', state.color);
				}
			});
			bar.animate(1.0);  // Number from 0.0 to 1.0
		};


		/* Get user location manually if geolocation fails */
		$scope.displayAddressField = false;

		function initPlacesAutocomplete() {
			let input = document.querySelector('#pac-input');

			const autocomplete = new google.maps.places.Autocomplete(input);
			const infowindow = new google.maps.InfoWindow();
			const infowindowContent = document.querySelector('#infowindow-content');
			infowindow.setContent(infowindowContent);

			autocomplete.addListener('place_changed', function () {
				infowindow.close();
				let place = autocomplete.getPlace();
				if (!place.geometry) { // User entered place not suggested
					window.alert("No details available for input: '" + place.name + "'");
					return;
				}

				// If address entered is a Places suggestion, update user location
				//console.log(place.geometry.location);
				let lat = place.geometry.location.lat();
				let lng = place.geometry.location.lng();
				LocationService.updateUserLocation(lat, lng);
				haveLocation = true;

				// Generate content for place suggestion box
				let address = '';
				if (place.address_components) {
					address = [
						(place.address_components[0] && place.address_components[0].short_name || ''),
						(place.address_components[1] && place.address_components[1].short_name || ''),
						(place.address_components[2] && place.address_components[2].short_name || '')
					].join(' ');
				}

				infowindowContent.children['place-icon'].src = place.icon;
				infowindowContent.children['place-name'].textContent = place.name;
				infowindowContent.children['place-address'].textContent = address;
			});
		}

		/* Get user location with geolocation */
		function getUserLocation() {

			// Initiate geolocation service
			let geo = navigator.geolocation;

			function geo_success(position) {
				let pos = position.coords;
				console.log(`current position: [${pos.latitude}, ${pos.longitude}]`);

				// Update user location in service
				LocationService.updateUserLocation(pos.latitude, pos.longitude);
				haveLocation = true;

				getUserDestination();
			};

			function geo_error(err) {
				console.log(`ERROR(${err.code}): ${err.message}`);
				$scope.displayAddressField = true;
				initPlacesAutocomplete();
			};

			let geo_options = {
				timeout: 5000,
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
