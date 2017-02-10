module.exports = {
	name: 'LocationService',
	
	func($http) {
		let currentPos = [undefined, undefined];
		//let finalPos = [undefined, undefined];
		let finalPos = [35.226143, -80.852892];
		
		let directions = undefined;
		
		return {
			getUserLocation() {
				return currentPos;
			},
			updateUserLocation(lat, lng) {
				currentPos = [lat, lng];
				return currentPos;
			},
			getDirections() {
				return $http.get(`https://maps.google.com/maps/api/directions/json?origin=${currentPos[0]},${currentPos[1]}&destination=${finalPos[0]},${finalPos[1]}&key=AIzaSyAoCv60nVilICtLnfFn7JMYvN_s04li5V0`).then(function(response) {
					let dir = response.data.routes[0].legs[0];
					console.log(dir);
					
					for (let i=0; i<dir.steps.length; i++) {
						console.log(dir.steps[i].html_instructions);
					}
					
					
				});
				
			}
		};
	},
	
};