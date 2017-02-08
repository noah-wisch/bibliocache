module.exports = {
    name: 'NewSessionController',
    func($scope, LocationService) {
		
		function getUserLocation() {
			// Initiate geolocation service
			let geo = navigator.geolocation;
			
			if ("geolocation" in navigator) {
				// user's location is available
			} else {
				alert("Geolocation services are not supported by your browser."); 
			}
			
			function success(position) {
				let pos = position.coords;
				
				console.log('Your current position is:');
				console.log(`Latitude : ${pos.latitude}`);
				console.log(`Longitude: ${pos.longitude}`);
				console.log(`More or less ${pos.accuracy} meters.`);
				
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
		getUserLocation();
		
		function updateLocation(lat, lng) {
			LocationService.updateUserLocation(lat, lng);
		};
    },
};
