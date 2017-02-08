module.exports = {
	name: 'LocationService',
	
	func($http) {
		let currentPos = [0, 0];
		
		return {
			getUserLocation() {
				console.log('I\'m here!');
				return currentPos;
			},
			updateUserLocation(lat, lng) {
				currentPos = [lat, lng];
				return currentPos;
			},
		};
	},
	
};