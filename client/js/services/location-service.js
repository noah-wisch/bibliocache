module.exports = {
	name: 'LocationService',
	
	func($http) {
		return {
			getLocation() {
				console.log('I\'m here!');
			},
		};
	},
	
};