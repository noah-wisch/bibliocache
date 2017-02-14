module.exports = {
	name: 'LocationService',

	func($http) {
		/* Define boudaries of app, only available to users in Charlotte, NC */
		/*let cityCenter = [35.2271, -80.8431];
		
		let Charlotte_Map = new google.maps.Map(document.querySelector('#charlotteMap'), {
			zoom: 15,
			center: cityCenter,
		});*/
		
		/*let circle = new google.maps.Circle({
			map: Charlotte_Map,
			center: cityCenter,
			radius: 1000,
			// metres
			//radius: 100000,
		});*/
		// Attach circle to marker
		/*circle.bindTo('center', markerCenter, 'position');
		// Get the bounds
		var bounds = circle.getBounds();
		console.log(bounds.contains(latLngA));*/
		
		
		/*
		Latitude: 1 deg = 68.7 mi
		Longitude: 1 deg = 69.2*cos(latitude) mi
		*/
		
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
			
			getDestination(maxRange) {
				// get bounds of the circle
				// get lat, lng contained in bounds
				endPos = [35.226143, -80.852892];
				return endPos;
			},

			getDirections() {
				if(currentPos && endPos) {
					return $http.get(`https://maps.google.com/maps/api/directions/json?origin=${currentPos[0]},${currentPos[1]}&destination=${endPos[0]},${endPos[1]}&key=AIzaSyAoCv60nVilICtLnfFn7JMYvN_s04li5V0`).then(function(response) {
						let dir = response.data.routes[0].legs[0];
						console.log(dir);

						for (let i=0; i<dir.steps.length; i++) {
							console.log(dir.steps[i].html_instructions);
						}

					});
				} else {
					console.log('Cannot get directions: user location or destination not defined.');
				}
			},
		};
	},

};