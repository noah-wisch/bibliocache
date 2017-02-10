module.exports = {
    name: 'MapController',
    func($scope, LocationService) {
		
		let location = LocationService.getUserLocation(); // returns an array
		if (location[0] === undefined || location[1] === undefined) {
			// get location
			console.log('location not defined');
		}
		
		let Map;
		let currentPos = {
			lat: location[0],
			lng: location[1],
		};
		let destination = {
			lat: 35.226143,
			lng: -80.852892,
		};
		let geo = navigator.geolocation;
		
		function initMap() {
			Map = new google.maps.Map(document.querySelector('#sessionMap'), {
				zoom: 15,
				center: currentPos,
			});
			
			// remove later, after we are 'watching' the user
			// will show dot instead of marker
			let tempMarker = new google.maps.Marker({
				position: currentPos,
				map: Map,
			});
			
			let Marker = new google.maps.Marker({
				position: destination,
				map: Map,
			});
		};
		initMap();
		
		let allowLocation = "geolocation" in navigator;
		
		function watchUserPos() {
			
			function watch_success(pos) {
				console.log(pos.coords.latitude + ', ' + pos.coords.longitude);
				
				if (destination.lat === pos.lat && destination.lng === pos.lng) {
					console.log('Congratulations, you reached the cache');
					geo.clearWatch(watch_id);
				}
			};
			
			function watch_error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
			}
			
			let watch_options = {
				enableHighAccuracy: true,
				//timeout: 5000,
				//maximumAge: 0
			};
			
			// Start watching user position
			if (navigator.geolocation) {
				let watch_id = navigator.geolocation.watchPosition(watch_success, watch_error, watch_options);
			} else {
				console.log('error');
			}
			
		};
		
		if (allowLocation) {
			watchUserPos();
		} else {
			alert("Geolocation services are not supported by your browser."); 
		}
		
		LocationService.getDirections();
		
	},
};