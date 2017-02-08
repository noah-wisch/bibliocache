module.exports = {
    name: 'NewSessionController',
    func($scope) {
		
	
		
		function getUserLocation() {
			// Initiate geolocation service
			let geo = navigator.geolocation;
			
			if ("geolocation" in navigator) {
				console.log('location available');
			} else {
				alert("Geolocation services are not supported by your browser."); 
			}
			
			function success(position) {
				let pos = position.coords;
				
				console.log('Your current position is:');
				console.log(`Latitude : ${pos.latitude}`);
				console.log(`Longitude: ${pos.longitude}`);
				console.log(`More or less ${pos.accuracy} meters.`);
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
		
        /**
         * two text boxes
         * drop-down menu w/ genres 
         */
    },
};
