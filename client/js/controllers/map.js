module.exports = {
    name: 'MapController',
    func($scope) {
		
		let map;
		function initMap() {
			map = new google.maps.Map(document.querySelector('#sessionMap'), {
				center: {lat: -34.397, lng: 150.644},
				zoom: 8,
			});
		}
		initMap();
		
    },
};