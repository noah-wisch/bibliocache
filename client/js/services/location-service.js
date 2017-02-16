module.exports = {
	name: 'LocationService',

	func($http) {
		
		/* Define locations relative to user */
		let currentPos = [];
		let endPos = [];

		return {
			getUserLocation() {
				return currentPos;
			},
			
			updateUserLocation(lat, lng) {
				currentPos = [lat, lng];
				return currentPos;
			},
			
			setDestination(maxRange) {
				// Convert maxRange (in miles) to range (in degrees)
				// 1 mi = approximately 0.015 deg
				let range = maxRange * 0.015;
				
				// Create rectangular bounds around current location to set a destination within the max range
				// If range is 0.1 deg, the difference from current location will be +/- 0.05 deg for both lat and lng
				let latDest = currentPos[0] + (Math.random() - (0.5 * range) * 2);
				let lngDest = currentPos[1] + (Math.random() - (0.5 * range) * 2);
				
				endPos = [latDest, lngDest];
				console.log(endPos);
				return endPos;
			},
			
			getDestination() {
				return endPos;
			},
		};
	},

};