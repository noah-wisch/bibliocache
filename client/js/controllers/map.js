module.exports = {
    name: 'MapController',
    func($scope, LocationService) {
		
		let location = LocationService.getUserLocation(); // returns an array
		
		let Map;
		let currentPos = {
			lat: location[0],
			lng: location[1],
		};
		let destination = {
			lat: 35.226143,
			lng: -80.852892,
		};
		
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
		
    },
};