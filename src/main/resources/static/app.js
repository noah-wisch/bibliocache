(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const app = angular.module('BibliocacheApp', ['ui.router', 'ngMessages']).run(function ($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

const routes = require('./routes');

app.config($stateProvider => {
	for (let i = 0; i < routes.length; i++) {
		$stateProvider.state(routes[i]);
	}
});

const controllers = [
	require('./controllers/registration'),
	require('./controllers/login'),
	require('./controllers/newSession'),
	require('./controllers/map'),
	require('./controllers/range'),

	];

for (let i = 0; i < controllers.length; i++) {
	app.controller(controllers[i].name, controllers[i].func);
}

const components = [
	require('./components/registration'),
	require('./components/login'),
	require('./components/newSession'),
	require('./components/map'),
	require('./components/range'),
];

for (let i = 0; i < components.length; i++) {
	app.component(components[i].name, components[i].func);
}

const services = [
	require('./services/user-service'),
	require('./services/book-service'),
	require('./services/location-service'),
];

for (let i = 0; i < services.length; i++) {
	app.factory(services[i].name, services[i].func);
}
},{"./components/login":2,"./components/map":3,"./components/newSession":4,"./components/range":5,"./components/registration":6,"./controllers/login":7,"./controllers/map":8,"./controllers/newSession":9,"./controllers/range":10,"./controllers/registration":11,"./routes":12,"./services/book-service":13,"./services/location-service":14,"./services/user-service":15}],2:[function(require,module,exports){
module.exports = {
	name: 'login',
	func: {
		templateUrl: 'templates/userLogin.html',
	},
};
},{}],3:[function(require,module,exports){
module.exports = {
	name: 'map',
	func: {
		templateUrl: 'templates/map.html',
	},
};
},{}],4:[function(require,module,exports){
module.exports = {
	name: 'newSession',
	func: {
		templateUrl: 'templates/newSession.html',
	},
};
},{}],5:[function(require,module,exports){
module.exports = {
	name: 'range',
	func: {
		templateUrl: 'templates/range.html',
	},
};
},{}],6:[function(require,module,exports){
module.exports = {
	name: 'registration',
	func: {
		templateUrl: 'templates/userRegistration.html',
	},
};
},{}],7:[function(require,module,exports){
module.exports = {
	name: 'LoginController',

	func($scope, $state, UserService) {
		$scope.email = '';
		$scope.emailValidation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		console.log($scope.email);


		$scope.loginToAccount = (email, password) => {
			let user = {
				email: email,
				password: password,
			};

			UserService.logInUser(user).then(function () {
				$state.go('new-session');
			});
		};
	},
};
},{}],8:[function(require,module,exports){
module.exports = {
    name: 'MapController',
    func($scope, LocationService) {

				let location = LocationService.getUserLocation(); 
		if (location[0] === undefined || location[1] === undefined) {
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
			};

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
},{}],9:[function(require,module,exports){
module.exports = {
	name: 'NewSessionController',
	func($scope, LocationService, BookService) {

		$scope.genres = BookService.getAllGenres();
		console.log($scope.genres);

		$scope.submitGenre = () => {
			console.log($scope.selectedGenre);
		};

		function getUserLocation() {
			let geo = navigator.geolocation;

			function geo_success(position) {
				let pos = position.coords;
				console.log(`current position: [${pos.latitude}, ${pos.longitude}]`);
				updateLocation(pos.latitude, pos.longitude);
			};

			function geo_error(err) {
				console.warn(`ERROR(${err.code}): ${err.message}`);
			};

			let geo_options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

			geo.getCurrentPosition(geo_success, geo_error, geo_options);
		};

		if ("geolocation" in navigator) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}

		function updateLocation(lat, lng) {
			LocationService.updateUserLocation(lat, lng);
		};
	},
};

},{}],10:[function(require,module,exports){
module.exports = {
    name: 'InRangeController',
    func($scope) {

		    },
};
},{}],11:[function(require,module,exports){
module.exports = {
    name: 'RegistrationController',

	    func($scope, $state, UserService) {
        $scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				$scope.passwordValidation = /^[*]+$/;

				$scope.readingLevelValidation = /^[0-0]+$/;
		$scope.ageValidation = /^[0-9]+$/;

				$scope.createAccount = (email, password, readingLevel, age) => {
            let user = {
				email: email,
				password: password,
				readingLevel: readingLevel,
				category: 'Horror', 
				location: [0,0], 
				age: age,
			};

						UserService.registerUser(user).then(function() {
				$state.go('new-session');
			});
        };
    },
};
},{}],12:[function(require,module,exports){

module.exports = [
    {
        name: 'home',
        url: '',
        component: 'newSession',
    },
	{
        name: 'registration',
        url: '/register',
        component: 'registration',
    },
    {
        name: 'login',
        url: '/login',
        component: 'login',
    },
    {
        name: 'new-session',
        url: '/new-session', 
        component: 'newSession',
    },
    {
        name: 'map',
        url: '/map', 
        component: 'map',
    },
    {
        name: 'in-range',
        url: '/cache', 
        component: 'range',
    },
];


},{}],13:[function(require,module,exports){
module.exports = {
	name: 'BookService',

		func($http) {
		let genres = [
			'Comedy', 'Horror', 'Fantasy', 'Children\'s Books', 'Action', 'Romance', 'Fiction', 'Non-Fiction'
		];
		let sessionGenre = '';

				return {
            submitGenre(value) {
                $http.post('https://enigmatic-woodland-53824.herokuapp.com/registration')
            },

						getAllGenres() {
				return genres;
			},

						getBooks() { 
				return $http.get('https://enigmatic-woodland-53824.herokuapp.com/').then(function(response) {
					let bookList = response.data;;
					console.log(bookList);

										for (let i=0; i<bookList.length; i++) {
						console.log(bookList[i].title);
					}
				});
			},

			        };
	},
}
},{}],14:[function(require,module,exports){
module.exports = {
	name: 'LocationService',

	func($http) {
		let currentPos = [undefined, undefined];
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

							},
		};
	},

};
},{}],15:[function(require,module,exports){
module.exports = {
	name: 'UserService',

		func($http) {
		return {
			registerUser(user) {
				console.log('posting new user');
				return {};
			},

						logInUser(user) {
				console.log('posting existing user');
				return {};
			},

						newSession() {
				console.log('new session');
			},

					};
	},

	};
},{}]},{},[1]);