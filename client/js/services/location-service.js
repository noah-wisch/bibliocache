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
				let latRange = maxRange * 0.015; // 1 mi lat = approx 1/69 deg lat
				let lngRange = maxRange * 0.019; // 1 mi lng = approx 1/53 deg lng

				/** Create rectangular bounds around current location to set a 
				 * destination within the max range. 
				 * If range is 0.1 deg, the difference from current location 
				 * will be +/- 0.05 deg for both lat and lng
				 */

				let latDest = currentPos[0] + (Math.random() - 0.5) * latRange;
				let lngDest = currentPos[1] + (Math.random() - 0.5) * lngRange;

				console.log('destination: [' + latDest, lngDest + ']');
				endPos = [latDest, lngDest];
				return endPos;
			},

			getDestination() {
				return endPos;
			},
		};
	},
};