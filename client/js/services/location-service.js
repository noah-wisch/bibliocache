module.exports = {
	name: 'LocationService',

	func($http) {
		
		/* Define locations relative to user */
		let currentPos;
		let endPos;
		let directions;

		return {
			getUserLocation() {
				// check that user is in Charlotte
				//
				return currentPos;
			},
			
			updateUserLocation(lat, lng) {
				currentPos = [lat, lng];
				return currentPos;
			},
			
			setDestination(maxRange) {
				// 1 mi = approximately 0.015 deg
				// 3 mi = ~0.045 deg
				
				endPos = [35.226143, -80.852892];
				return endPos;
			},
			
			getDestination() {
				return endPos;
			},
		};
	},

};