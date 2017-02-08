module.exports = {
    name: 'NewSessionController',
    func($scope, LocationService) {
		
		let allowLocation = "geolocation" in navigator;
		
		function getUserLocation() {
			// Initiate geolocation service
			let geo = navigator.geolocation;
			
			function success(position) {
				let pos = position.coords;
				console.log(`current position: [${pos.latitude}, ${pos.longitude}]`);
				updateLocation(pos.latitude, pos.longitude);
			};
			
			function error(err) {
				console.warn(`ERROR(${err.code}): ${err.message}`);
			};
			
			let positionOptions = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};
			
			geo.getCurrentPosition(success, error, positionOptions);
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
