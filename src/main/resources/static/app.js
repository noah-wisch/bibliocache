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
	require('./controllers/endSession'),

	];

for (let i = 0; i < controllers.length; i++) {
	app.controller(controllers[i].name, controllers[i].func);
}

const components = [
	require('./components/registration'),
	require('./components/login'),
	require('./components/newSession'),
	require('./components/map'),
	require('./components/endSession'),
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
},{"./components/endSession":2,"./components/login":3,"./components/map":4,"./components/newSession":5,"./components/registration":6,"./controllers/endSession":7,"./controllers/login":8,"./controllers/map":9,"./controllers/newSession":10,"./controllers/registration":11,"./routes":12,"./services/book-service":13,"./services/location-service":14,"./services/user-service":15}],2:[function(require,module,exports){
module.exports = {
	name: 'endSession',
	func: {
		templateUrl: 'templates/endSession.html',
	},
};
},{}],3:[function(require,module,exports){
module.exports = {
	name: 'login',
	func: {
		templateUrl: 'templates/userLogin.html',
	},
};
},{}],4:[function(require,module,exports){
module.exports = {
	name: 'map',
	func: {
		templateUrl: 'templates/map.html',
	},
};
},{}],5:[function(require,module,exports){
module.exports = {
	name: 'newSession',
	func: {
		templateUrl: 'templates/newSession.html',
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
    name: 'EndSessionController',
    func($scope) {
		console.log('ending session');
    },
};
},{}],8:[function(require,module,exports){
module.exports = {
	name: 'LoginController',

	func($scope, $state, UserService) {
		$scope.email = '';
		$scope.emailValidation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		$scope.password = '';
		$scope.passwordValidation = /^[a-zA-Z]\w{3,14}$/;

		$scope.loginToAccount = (email, password) => {
			let user = {
				email: email,
				password: password,
			};

			UserService.logInUser(user);
		};
	},
};
},{}],9:[function(require,module,exports){
module.exports = {
	name: 'MapController',
	func($scope, $state, LocationService) {
		let userPos = LocationService.getUserLocation();
		let endPos = LocationService.getDestination();

				if (userPos.length === 0) {
			$state.go('new-session');
		}

		let Map, Street;
		let currentPos = { 
			lat: userPos[0],
			lng: userPos[1],
		};
		let destination = { 
			lat: endPos[0],
			lng: endPos[1],
		};

		let geo = navigator.geolocation;


		function initMap() {

						let styledMapType = new google.maps.StyledMapType(
				[{"stylers":[{"hue":"#16A085"},{"saturation":0}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]}],
				{name: 'Styled Map'}
			);

						Map = new google.maps.Map(document.querySelector('#sessionMap'), {
				zoom: 15,
				center: currentPos,
			});

						Map.mapTypes.set('styled_map', styledMapType);
        	Map.setMapTypeId('styled_map');

			let rendererOptions = {
				map: Map,
				suppressMarkers: true,
			};
			const directionsService = new google.maps.DirectionsService;
			const directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

			directionsDisplay.setMap(Map);
			directionsDisplay.setPanel(document.querySelector('#directions'));
			directionsDisplay.setOptions({
				polylineOptions: {
					strokeColor: '#581845',
				}
			});

						function createMarker(position, icon) {
				let marker = new google.maps.Marker({
					position: position,
					map: Map,
					icon: icon,
				});
			}

			function calculateAndDisplayRoute(directionsService, directionsDisplay) {
				directionsService.route({
					origin: currentPos,
					destination: destination,
					travelMode: 'WALKING',
				}, (response, status) => {
					if (status === 'OK') {
						let route = response.routes[0].legs[0]; 
						createMarker(route.start_location, 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
						createMarker(route.end_location, 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
						directionsDisplay.setDirections(response);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				});
			};
			calculateAndDisplayRoute(directionsService, directionsDisplay);

			let userMarker = new google.maps.Marker({
				position: currentPos,
				map: Map,
				icon: "assets/user.png",
			});

			let userRadius = new google.maps.Circle({
				strokeColor: '#581845',
				strokeOpacity: 1,
				strokeWeight: 0.8,
				fillColor: '#581845',
				fillOpacity: 0.4,
				map: Map,
				center: currentPos,
				radius: 50,
			});

					};
		initMap();


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


		if ("geolocation" in navigator) {
			watchUserPos();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}

	},
};
},{}],10:[function(require,module,exports){
module.exports = {
	name: 'NewSessionController',
	func($scope, $state, $interval, UserService, LocationService, BookService) {

				let haveGenre = false;
		let haveLocation = false;
		let haveDestination = false;

		$scope.genres = BookService.getAllGenres(); 

				$scope.submitGenre = () => { 
			UserService.setGenre($scope.selectedGenre);
			haveGenre = true;

						const ProgressBar = require('progressbar.js')
			const bar = new ProgressBar.Line(container, {
				strokeWidth: 4,
				easing: 'easeInOut',
				duration: 5000,
				color: '#FFEA82',
				trailColor: '#eee',
				trailWidth: 1,
				svgStyle: { width: '100%', height: '100%' },
				from: { color: '#FFEA82' },
				to: { color: '#ED6A5A' },
				step: (state, bar) => {
					bar.path.setAttribute('stroke', state.color);
				}
			});
			bar.animate(1.0);  
		};


		function getUserLocation(tries=0) {

			let geo = navigator.geolocation;

			if(tries > 3) { 
				console.warn(`ERROR(${err.code}): ${err.message}`);
				return;
			}

						function geo_success(position) {
				let pos = position.coords;
				console.log(`current position: [${pos.latitude}, ${pos.longitude}]`);

				LocationService.updateUserLocation(pos.latitude, pos.longitude);
				haveLocation = true;

								getUserDestination();
			};

						function geo_error(err) {
				console.log('noah tell margo that the recursion function worked!');
				getUserLocation(tries+1);
			};

			let geo_options = {
				timeout: 5000,
				maximumAge: 0,
			};

			geo.getCurrentPosition(geo_success, geo_error, geo_options);
		};


		function getUserDestination() {
			let age = UserService.getUserInfo.age;
			let range;
			if (age < 12) {
				range = 1;
			} else {
				range = 3;
			}
			LocationService.setDestination(range);
			haveDestination = true;
		};


		if ("geolocation" in navigator) {
			getUserLocation();
		} else {
			alert("Geolocation services are not supported by your browser.");
		}


		function startGame() {
			if (haveGenre && haveLocation && haveDestination) {
				stopChecking();
				$state.go('map');
			}
		};

		let wait;

				function checkForData() {
			wait = $interval(startGame, 1000);
		};

				function stopChecking() {
			$interval.cancel(wait);
		};

				checkForData();
	},
};

},{"progressbar.js":18}],11:[function(require,module,exports){
module.exports = {
	name: 'RegistrationController',

	func($scope, $state, UserService) {
		$scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		$scope.password = '';
		$scope.passwordValidation = /^[a-zA-Z]\w{3,14}$/;
		$scope.readingLevelValidation = /^[0-9]+$/;
		$scope.ageValidation = /^[0-9]+$/;

		$scope.form = {
			readingLevel: 0,
			age: 0,
		};

		$scope.createAccount = (email, password, readingLevel, age) => {

			let user = {
				age: age,
				category: 'Horror', 
				email: email,
				location: [0, 0], 
				password: password,
				readingLevel: readingLevel,
			};

						UserService.registerUser(user);
		};
	},
};
},{}],12:[function(require,module,exports){

module.exports = [
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
        name: 'end-session',
        url: '/books',
        component: 'endSession',
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
				let latRange = maxRange * 0.015; 
				let lngRange = maxRange * 0.019; 

				let intensity = () => {
					return Math.random() * (.99 - .01) + .01;
				};

				let latDest = currentPos[0] + (intensity() * (1 - latRange/2));
				let lngDest = currentPos[1] + (intensity() * (1 - lngRange/2));

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
},{}],15:[function(require,module,exports){
module.exports = {
	name: 'UserService',

	func($http) {

		function User(age, genre, readingLevel) {
			this.age = age;
			this.genre = genre;
			this.readingLevel = readingLevel;

						return this;
		}
		let user = new User(30, 'Horror', 14);

				return {
			registerUser(newUser) {
				user.age = newUser.age;
				user.genre = newUser.category;
				user.readingLevel = newUser.readingLevel;

								return $http.post('/registration', newUser);
			},

			logInUser(user) {
				return $http.post('/login', user);
			},

			getUserInfo() {
				return user;
			},

						setGenre(genre) {
				user.genre = genre;
			},

		};
	},

};
},{}],16:[function(require,module,exports){

var Shape = require('./shape');
var utils = require('./utils');

var Circle = function Circle(container, options) {
    this._pathTemplate =
        'M 50,50 m 0,-{radius}' +
        ' a {radius},{radius} 0 1 1 0,{2radius}' +
        ' a {radius},{radius} 0 1 1 0,-{2radius}';

    this.containerAspectRatio = 1;

    Shape.apply(this, arguments);
};

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype._pathString = function _pathString(opts) {
    var widthOfWider = opts.strokeWidth;
    if (opts.trailWidth && opts.trailWidth > opts.strokeWidth) {
        widthOfWider = opts.trailWidth;
    }

    var r = 50 - widthOfWider / 2;

    return utils.render(this._pathTemplate, {
        radius: r,
        '2radius': r * 2
    });
};

Circle.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Circle;

},{"./shape":21,"./utils":22}],17:[function(require,module,exports){

var Shape = require('./shape');
var utils = require('./utils');

var Line = function Line(container, options) {
    this._pathTemplate = 'M 0,{center} L 100,{center}';
    Shape.apply(this, arguments);
};

Line.prototype = new Shape();
Line.prototype.constructor = Line;

Line.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 ' + opts.strokeWidth);
    svg.setAttribute('preserveAspectRatio', 'none');
};

Line.prototype._pathString = function _pathString(opts) {
    return utils.render(this._pathTemplate, {
        center: opts.strokeWidth / 2
    });
};

Line.prototype._trailString = function _trailString(opts) {
    return this._pathString(opts);
};

module.exports = Line;

},{"./shape":21,"./utils":22}],18:[function(require,module,exports){
module.exports = {
    Line: require('./line'),
    Circle: require('./circle'),
    SemiCircle: require('./semicircle'),

    Path: require('./path'),

    Shape: require('./shape'),

    utils: require('./utils')
};

},{"./circle":16,"./line":17,"./path":19,"./semicircle":20,"./shape":21,"./utils":22}],19:[function(require,module,exports){

var Tweenable = require('shifty');
var utils = require('./utils');

var EASING_ALIASES = {
    easeIn: 'easeInCubic',
    easeOut: 'easeOutCubic',
    easeInOut: 'easeInOutCubic'
};

var Path = function Path(path, opts) {
    if (!(this instanceof Path)) {
        throw new Error('Constructor was called without new keyword');
    }

    opts = utils.extend({
        duration: 800,
        easing: 'linear',
        from: {},
        to: {},
        step: function() {}
    }, opts);

    var element;
    if (utils.isString(path)) {
        element = document.querySelector(path);
    } else {
        element = path;
    }

    this.path = element;
    this._opts = opts;
    this._tweenable = null;

    var length = this.path.getTotalLength();
    this.path.style.strokeDasharray = length + ' ' + length;
    this.set(0);
};

Path.prototype.value = function value() {
    var offset = this._getComputedDashOffset();
    var length = this.path.getTotalLength();

    var progress = 1 - offset / length;
    return parseFloat(progress.toFixed(6), 10);
};

Path.prototype.set = function set(progress) {
    this.stop();

    this.path.style.strokeDashoffset = this._progressToOffset(progress);

    var step = this._opts.step;
    if (utils.isFunction(step)) {
        var easing = this._easing(this._opts.easing);
        var values = this._calculateTo(progress, easing);
        var reference = this._opts.shape || this;
        step(values, reference, this._opts.attachment);
    }
};

Path.prototype.stop = function stop() {
    this._stopTween();
    this.path.style.strokeDashoffset = this._getComputedDashOffset();
};

Path.prototype.animate = function animate(progress, opts, cb) {
    opts = opts || {};

    if (utils.isFunction(opts)) {
        cb = opts;
        opts = {};
    }

    var passedOpts = utils.extend({}, opts);

    var defaultOpts = utils.extend({}, this._opts);
    opts = utils.extend(defaultOpts, opts);

    var shiftyEasing = this._easing(opts.easing);
    var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);

    this.stop();

    this.path.getBoundingClientRect();

    var offset = this._getComputedDashOffset();
    var newOffset = this._progressToOffset(progress);

    var self = this;
    this._tweenable = new Tweenable();
    this._tweenable.tween({
        from: utils.extend({ offset: offset }, values.from),
        to: utils.extend({ offset: newOffset }, values.to),
        duration: opts.duration,
        easing: shiftyEasing,
        step: function(state) {
            self.path.style.strokeDashoffset = state.offset;
            var reference = opts.shape || self;
            opts.step(state, reference, opts.attachment);
        },
        finish: function(state) {
            if (utils.isFunction(cb)) {
                cb();
            }
        }
    });
};

Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
    var computedStyle = window.getComputedStyle(this.path, null);
    return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
};

Path.prototype._progressToOffset = function _progressToOffset(progress) {
    var length = this.path.getTotalLength();
    return length - progress * length;
};

Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
    if (opts.from && opts.to) {
        return {
            from: opts.from,
            to: opts.to
        };
    }

    return {
        from: this._calculateFrom(easing),
        to: this._calculateTo(progress, easing)
    };
};

Path.prototype._calculateFrom = function _calculateFrom(easing) {
    return Tweenable.interpolate(this._opts.from, this._opts.to, this.value(), easing);
};

Path.prototype._calculateTo = function _calculateTo(progress, easing) {
    return Tweenable.interpolate(this._opts.from, this._opts.to, progress, easing);
};

Path.prototype._stopTween = function _stopTween() {
    if (this._tweenable !== null) {
        this._tweenable.stop();
        this._tweenable = null;
    }
};

Path.prototype._easing = function _easing(easing) {
    if (EASING_ALIASES.hasOwnProperty(easing)) {
        return EASING_ALIASES[easing];
    }

    return easing;
};

module.exports = Path;

},{"./utils":22,"shifty":23}],20:[function(require,module,exports){

var Shape = require('./shape');
var Circle = require('./circle');
var utils = require('./utils');

var SemiCircle = function SemiCircle(container, options) {
    this._pathTemplate =
        'M 50,50 m -{radius},0' +
        ' a {radius},{radius} 0 1 1 {2radius},0';

    this.containerAspectRatio = 2;

    Shape.apply(this, arguments);
};

SemiCircle.prototype = new Shape();
SemiCircle.prototype.constructor = SemiCircle;

SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 50');
};

SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(
    opts,
    container,
    textContainer
) {
    if (opts.text.style) {
        textContainer.style.top = 'auto';
        textContainer.style.bottom = '0';

        if (opts.text.alignToBottom) {
            utils.setStyle(textContainer, 'transform', 'translate(-50%, 0)');
        } else {
            utils.setStyle(textContainer, 'transform', 'translate(-50%, 50%)');
        }
    }
};

SemiCircle.prototype._pathString = Circle.prototype._pathString;
SemiCircle.prototype._trailString = Circle.prototype._trailString;

module.exports = SemiCircle;

},{"./circle":16,"./shape":21,"./utils":22}],21:[function(require,module,exports){

var Path = require('./path');
var utils = require('./utils');

var DESTROYED_ERROR = 'Object is destroyed';

var Shape = function Shape(container, opts) {
    if (!(this instanceof Shape)) {
        throw new Error('Constructor was called without new keyword');
    }

    if (arguments.length === 0) {
        return;
    }

    this._opts = utils.extend({
        color: '#555',
        strokeWidth: 1.0,
        trailColor: null,
        trailWidth: null,
        fill: null,
        text: {
            style: {
                color: null,
                position: 'absolute',
                left: '50%',
                top: '50%',
                padding: 0,
                margin: 0,
                transform: {
                    prefix: true,
                    value: 'translate(-50%, -50%)'
                }
            },
            autoStyleContainer: true,
            alignToBottom: true,
            value: null,
            className: 'progressbar-text'
        },
        svgStyle: {
            display: 'block',
            width: '100%'
        },
        warnings: false
    }, opts, true);  

    if (utils.isObject(opts) && opts.svgStyle !== undefined) {
        this._opts.svgStyle = opts.svgStyle;
    }
    if (utils.isObject(opts) && utils.isObject(opts.text) && opts.text.style !== undefined) {
        this._opts.text.style = opts.text.style;
    }

    var svgView = this._createSvgView(this._opts);

    var element;
    if (utils.isString(container)) {
        element = document.querySelector(container);
    } else {
        element = container;
    }

    if (!element) {
        throw new Error('Container does not exist: ' + container);
    }

    this._container = element;
    this._container.appendChild(svgView.svg);
    if (this._opts.warnings) {
        this._warnContainerAspectRatio(this._container);
    }

    if (this._opts.svgStyle) {
        utils.setStyles(svgView.svg, this._opts.svgStyle);
    }

    this.svg = svgView.svg;
    this.path = svgView.path;
    this.trail = svgView.trail;
    this.text = null;

    var newOpts = utils.extend({
        attachment: undefined,
        shape: this
    }, this._opts);
    this._progressPath = new Path(svgView.path, newOpts);

    if (utils.isObject(this._opts.text) && this._opts.text.value !== null) {
        this.setText(this._opts.text.value);
    }
};

Shape.prototype.animate = function animate(progress, opts, cb) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this._progressPath.animate(progress, opts, cb);
};

Shape.prototype.stop = function stop() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return;
    }

    this._progressPath.stop();
};

Shape.prototype.destroy = function destroy() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this.stop();
    this.svg.parentNode.removeChild(this.svg);
    this.svg = null;
    this.path = null;
    this.trail = null;
    this._progressPath = null;

    if (this.text !== null) {
        this.text.parentNode.removeChild(this.text);
        this.text = null;
    }
};

Shape.prototype.set = function set(progress) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    this._progressPath.set(progress);
};

Shape.prototype.value = function value() {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this._progressPath === undefined) {
        return 0;
    }

    return this._progressPath.value();
};

Shape.prototype.setText = function setText(newText) {
    if (this._progressPath === null) {
        throw new Error(DESTROYED_ERROR);
    }

    if (this.text === null) {
        this.text = this._createTextContainer(this._opts, this._container);
        this._container.appendChild(this.text);
    }

    if (utils.isObject(newText)) {
        utils.removeChildren(this.text);
        this.text.appendChild(newText);
    } else {
        this.text.innerHTML = newText;
    }
};

Shape.prototype._createSvgView = function _createSvgView(opts) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._initializeSvg(svg, opts);

    var trailPath = null;
    if (opts.trailColor || opts.trailWidth) {
        trailPath = this._createTrail(opts);
        svg.appendChild(trailPath);
    }

    var path = this._createPath(opts);
    svg.appendChild(path);

    return {
        svg: svg,
        path: path,
        trail: trailPath
    };
};

Shape.prototype._initializeSvg = function _initializeSvg(svg, opts) {
    svg.setAttribute('viewBox', '0 0 100 100');
};

Shape.prototype._createPath = function _createPath(opts) {
    var pathString = this._pathString(opts);
    return this._createPathElement(pathString, opts);
};

Shape.prototype._createTrail = function _createTrail(opts) {
    var pathString = this._trailString(opts);

    var newOpts = utils.extend({}, opts);

    if (!newOpts.trailColor) {
        newOpts.trailColor = '#eee';
    }
    if (!newOpts.trailWidth) {
        newOpts.trailWidth = newOpts.strokeWidth;
    }

    newOpts.color = newOpts.trailColor;
    newOpts.strokeWidth = newOpts.trailWidth;

    newOpts.fill = null;

    return this._createPathElement(pathString, newOpts);
};

Shape.prototype._createPathElement = function _createPathElement(pathString, opts) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    path.setAttribute('stroke', opts.color);
    path.setAttribute('stroke-width', opts.strokeWidth);

    if (opts.fill) {
        path.setAttribute('fill', opts.fill);
    } else {
        path.setAttribute('fill-opacity', '0');
    }

    return path;
};

Shape.prototype._createTextContainer = function _createTextContainer(opts, container) {
    var textContainer = document.createElement('div');
    textContainer.className = opts.text.className;

    var textStyle = opts.text.style;
    if (textStyle) {
        if (opts.text.autoStyleContainer) {
            container.style.position = 'relative';
        }

        utils.setStyles(textContainer, textStyle);
        if (!textStyle.color) {
            textContainer.style.color = opts.color;
        }
    }

    this._initializeTextContainer(opts, container, textContainer);
    return textContainer;
};

Shape.prototype._initializeTextContainer = function(opts, container, element) {
};

Shape.prototype._pathString = function _pathString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._trailString = function _trailString(opts) {
    throw new Error('Override this function for each progress bar');
};

Shape.prototype._warnContainerAspectRatio = function _warnContainerAspectRatio(container) {
    if (!this.containerAspectRatio) {
        return;
    }

    var computedStyle = window.getComputedStyle(container, null);
    var width = parseFloat(computedStyle.getPropertyValue('width'), 10);
    var height = parseFloat(computedStyle.getPropertyValue('height'), 10);
    if (!utils.floatEquals(this.containerAspectRatio, width / height)) {
        console.warn(
            'Incorrect aspect ratio of container',
            '#' + container.id,
            'detected:',
            computedStyle.getPropertyValue('width') + '(width)',
            '/',
            computedStyle.getPropertyValue('height') + '(height)',
            '=',
            width / height
        );

        console.warn(
            'Aspect ratio of should be',
            this.containerAspectRatio
        );
    }
};

module.exports = Shape;

},{"./path":19,"./utils":22}],22:[function(require,module,exports){

var PREFIXES = 'Webkit Moz O ms'.split(' ');
var FLOAT_COMPARISON_EPSILON = 0.001;

function extend(destination, source, recursive) {
    destination = destination || {};
    source = source || {};
    recursive = recursive || false;

    for (var attrName in source) {
        if (source.hasOwnProperty(attrName)) {
            var destVal = destination[attrName];
            var sourceVal = source[attrName];
            if (recursive && isObject(destVal) && isObject(sourceVal)) {
                destination[attrName] = extend(destVal, sourceVal, recursive);
            } else {
                destination[attrName] = sourceVal;
            }
        }
    }

    return destination;
}

function render(template, vars) {
    var rendered = template;

    for (var key in vars) {
        if (vars.hasOwnProperty(key)) {
            var val = vars[key];
            var regExpString = '\\{' + key + '\\}';
            var regExp = new RegExp(regExpString, 'g');

            rendered = rendered.replace(regExp, val);
        }
    }

    return rendered;
}

function setStyle(element, style, value) {
    var elStyle = element.style;  

    for (var i = 0; i < PREFIXES.length; ++i) {
        var prefix = PREFIXES[i];
        elStyle[prefix + capitalize(style)] = value;
    }

    elStyle[style] = value;
}

function setStyles(element, styles) {
    forEachObject(styles, function(styleValue, styleName) {
        if (styleValue === null || styleValue === undefined) {
            return;
        }

        if (isObject(styleValue) && styleValue.prefix === true) {
            setStyle(element, styleName, styleValue.value);
        } else {
            element.style[styleName] = styleValue;
        }
    });
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
}

function isFunction(obj) {
    return typeof obj === 'function';
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isObject(obj) {
    if (isArray(obj)) {
        return false;
    }

    var type = typeof obj;
    return type === 'object' && !!obj;
}

function forEachObject(object, callback) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var val = object[key];
            callback(val, key);
        }
    }
}

function floatEquals(a, b) {
    return Math.abs(a - b) < FLOAT_COMPARISON_EPSILON;
}

function removeChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

module.exports = {
    extend: extend,
    render: render,
    setStyle: setStyle,
    setStyles: setStyles,
    capitalize: capitalize,
    isString: isString,
    isFunction: isFunction,
    isObject: isObject,
    forEachObject: forEachObject,
    floatEquals: floatEquals,
    removeChildren: removeChildren
};

},{}],23:[function(require,module,exports){
;(function () {
  var root = this || Function('return this')();


var Tweenable = (function () {

  'use strict';

  var formula;

  var DEFAULT_SCHEDULE_FUNCTION;
  var DEFAULT_EASING = 'linear';
  var DEFAULT_DURATION = 500;
  var UPDATE_TIME = 1000 / 60;

  var _now = Date.now
       ? Date.now
       : function () {return +new Date();};

  var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;

  if (typeof window !== 'undefined') {
    DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
       || window.webkitRequestAnimationFrame
       || window.oRequestAnimationFrame
       || window.msRequestAnimationFrame
       || (window.mozCancelRequestAnimationFrame
       && window.mozRequestAnimationFrame)
       || setTimeout;
  } else {
    DEFAULT_SCHEDULE_FUNCTION = setTimeout;
  }

  function noop () {
  }

  function each (obj, fn) {
    var key;
    for (key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        fn(key);
      }
    }
  }

  function shallowCopy (targetObj, srcObj) {
    each(srcObj, function (prop) {
      targetObj[prop] = srcObj[prop];
    });

    return targetObj;
  }

  function defaults (target, src) {
    each(src, function (prop) {
      if (typeof target[prop] === 'undefined') {
        target[prop] = src[prop];
      }
    });
  }

  function tweenProps (forPosition, currentState, originalState, targetState,
    duration, timestamp, easing) {
    var normalizedPosition =
        forPosition < timestamp ? 0 : (forPosition - timestamp) / duration;


    var prop;
    var easingObjectProp;
    var easingFn;
    for (prop in currentState) {
      if (currentState.hasOwnProperty(prop)) {
        easingObjectProp = easing[prop];
        easingFn = typeof easingObjectProp === 'function'
          ? easingObjectProp
          : formula[easingObjectProp];

        currentState[prop] = tweenProp(
          originalState[prop],
          targetState[prop],
          easingFn,
          normalizedPosition
        );
      }
    }

    return currentState;
  }

  function tweenProp (start, end, easingFunc, position) {
    return start + (end - start) * easingFunc(position);
  }

  function applyFilter (tweenable, filterName) {
    var filters = Tweenable.prototype.filter;
    var args = tweenable._filterArgs;

    each(filters, function (name) {
      if (typeof filters[name][filterName] !== 'undefined') {
        filters[name][filterName].apply(tweenable, args);
      }
    });
  }

  var timeoutHandler_endTime;
  var timeoutHandler_currentTime;
  var timeoutHandler_isEnded;
  var timeoutHandler_offset;
  function timeoutHandler (tweenable, timestamp, delay, duration, currentState,
    originalState, targetState, easing, step, schedule,
    opt_currentTimeOverride) {

    timeoutHandler_endTime = timestamp + delay + duration;

    timeoutHandler_currentTime =
    Math.min(opt_currentTimeOverride || now(), timeoutHandler_endTime);

    timeoutHandler_isEnded =
      timeoutHandler_currentTime >= timeoutHandler_endTime;

    timeoutHandler_offset = duration - (
      timeoutHandler_endTime - timeoutHandler_currentTime);

    if (tweenable.isPlaying()) {
      if (timeoutHandler_isEnded) {
        step(targetState, tweenable._attachment, timeoutHandler_offset);
        tweenable.stop(true);
      } else {
        tweenable._scheduleId =
          schedule(tweenable._timeoutHandler, UPDATE_TIME);

        applyFilter(tweenable, 'beforeTween');

        if (timeoutHandler_currentTime < (timestamp + delay)) {
          tweenProps(1, currentState, originalState, targetState, 1, 1, easing);
        } else {
          tweenProps(timeoutHandler_currentTime, currentState, originalState,
            targetState, duration, timestamp + delay, easing);
        }

        applyFilter(tweenable, 'afterTween');

        step(currentState, tweenable._attachment, timeoutHandler_offset);
      }
    }
  }


  function composeEasingObject (fromTweenParams, easing) {
    var composedEasing = {};
    var typeofEasing = typeof easing;

    if (typeofEasing === 'string' || typeofEasing === 'function') {
      each(fromTweenParams, function (prop) {
        composedEasing[prop] = easing;
      });
    } else {
      each(fromTweenParams, function (prop) {
        if (!composedEasing[prop]) {
          composedEasing[prop] = easing[prop] || DEFAULT_EASING;
        }
      });
    }

    return composedEasing;
  }

  function Tweenable (opt_initialState, opt_config) {
    this._currentState = opt_initialState || {};
    this._configured = false;
    this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

    if (typeof opt_config !== 'undefined') {
      this.setConfig(opt_config);
    }
  }

  Tweenable.prototype.tween = function (opt_config) {
    if (this._isTweening) {
      return this;
    }

    if (opt_config !== undefined || !this._configured) {
      this.setConfig(opt_config);
    }

    this._timestamp = now();
    this._start(this.get(), this._attachment);
    return this.resume();
  };

  Tweenable.prototype.setConfig = function (config) {
    config = config || {};
    this._configured = true;

    this._attachment = config.attachment;

    this._pausedAtTime = null;
    this._scheduleId = null;
    this._delay = config.delay || 0;
    this._start = config.start || noop;
    this._step = config.step || noop;
    this._finish = config.finish || noop;
    this._duration = config.duration || DEFAULT_DURATION;
    this._currentState = shallowCopy({}, config.from || this.get());
    this._originalState = this.get();
    this._targetState = shallowCopy({}, config.to || this.get());

    var self = this;
    this._timeoutHandler = function () {
      timeoutHandler(self,
        self._timestamp,
        self._delay,
        self._duration,
        self._currentState,
        self._originalState,
        self._targetState,
        self._easing,
        self._step,
        self._scheduleFunction
      );
    };

    var currentState = this._currentState;
    var targetState = this._targetState;

    defaults(targetState, currentState);

    this._easing = composeEasingObject(
      currentState, config.easing || DEFAULT_EASING);

    this._filterArgs =
      [currentState, this._originalState, targetState, this._easing];

    applyFilter(this, 'tweenCreated');
    return this;
  };

  Tweenable.prototype.get = function () {
    return shallowCopy({}, this._currentState);
  };

  Tweenable.prototype.set = function (state) {
    this._currentState = state;
  };

  Tweenable.prototype.pause = function () {
    this._pausedAtTime = now();
    this._isPaused = true;
    return this;
  };

  Tweenable.prototype.resume = function () {
    if (this._isPaused) {
      this._timestamp += now() - this._pausedAtTime;
    }

    this._isPaused = false;
    this._isTweening = true;

    this._timeoutHandler();

    return this;
  };

  Tweenable.prototype.seek = function (millisecond) {
    millisecond = Math.max(millisecond, 0);
    var currentTime = now();

    if ((this._timestamp + millisecond) === 0) {
      return this;
    }

    this._timestamp = currentTime - millisecond;

    if (!this.isPlaying()) {
      this._isTweening = true;
      this._isPaused = false;

      timeoutHandler(this,
        this._timestamp,
        this._delay,
        this._duration,
        this._currentState,
        this._originalState,
        this._targetState,
        this._easing,
        this._step,
        this._scheduleFunction,
        currentTime
      );

      this.pause();
    }

    return this;
  };

  Tweenable.prototype.stop = function (gotoEnd) {
    this._isTweening = false;
    this._isPaused = false;
    this._timeoutHandler = noop;

    (root.cancelAnimationFrame            ||
    root.webkitCancelAnimationFrame     ||
    root.oCancelAnimationFrame          ||
    root.msCancelAnimationFrame         ||
    root.mozCancelRequestAnimationFrame ||
    root.clearTimeout)(this._scheduleId);

    if (gotoEnd) {
      applyFilter(this, 'beforeTween');
      tweenProps(
        1,
        this._currentState,
        this._originalState,
        this._targetState,
        1,
        0,
        this._easing
      );
      applyFilter(this, 'afterTween');
      applyFilter(this, 'afterTweenEnd');
      this._finish.call(this, this._currentState, this._attachment);
    }

    return this;
  };

  Tweenable.prototype.isPlaying = function () {
    return this._isTweening && !this._isPaused;
  };

  Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
    this._scheduleFunction = scheduleFunction;
  };

  Tweenable.prototype.dispose = function () {
    var prop;
    for (prop in this) {
      if (this.hasOwnProperty(prop)) {
        delete this[prop];
      }
    }
  };

  Tweenable.prototype.filter = {};

  Tweenable.prototype.formula = {
    linear: function (pos) {
      return pos;
    }
  };

  formula = Tweenable.prototype.formula;

  shallowCopy(Tweenable, {
    'now': now
    ,'each': each
    ,'tweenProps': tweenProps
    ,'tweenProp': tweenProp
    ,'applyFilter': applyFilter
    ,'shallowCopy': shallowCopy
    ,'defaults': defaults
    ,'composeEasingObject': composeEasingObject
  });


  if (typeof SHIFTY_DEBUG_NOW === 'function') {
    root.timeoutHandler = timeoutHandler;
  }

  if (typeof exports === 'object') {
    module.exports = Tweenable;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {return Tweenable;});
  } else if (typeof root.Tweenable === 'undefined') {
    root.Tweenable = Tweenable;
  }

  return Tweenable;

} ());



;(function () {

  Tweenable.shallowCopy(Tweenable.prototype.formula, {
    easeInQuad: function (pos) {
      return Math.pow(pos, 2);
    },

    easeOutQuad: function (pos) {
      return -(Math.pow((pos - 1), 2) - 1);
    },

    easeInOutQuad: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,2);}
      return -0.5 * ((pos -= 2) * pos - 2);
    },

    easeInCubic: function (pos) {
      return Math.pow(pos, 3);
    },

    easeOutCubic: function (pos) {
      return (Math.pow((pos - 1), 3) + 1);
    },

    easeInOutCubic: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,3);}
      return 0.5 * (Math.pow((pos - 2),3) + 2);
    },

    easeInQuart: function (pos) {
      return Math.pow(pos, 4);
    },

    easeOutQuart: function (pos) {
      return -(Math.pow((pos - 1), 4) - 1);
    },

    easeInOutQuart: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
      return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
    },

    easeInQuint: function (pos) {
      return Math.pow(pos, 5);
    },

    easeOutQuint: function (pos) {
      return (Math.pow((pos - 1), 5) + 1);
    },

    easeInOutQuint: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,5);}
      return 0.5 * (Math.pow((pos - 2),5) + 2);
    },

    easeInSine: function (pos) {
      return -Math.cos(pos * (Math.PI / 2)) + 1;
    },

    easeOutSine: function (pos) {
      return Math.sin(pos * (Math.PI / 2));
    },

    easeInOutSine: function (pos) {
      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },

    easeInExpo: function (pos) {
      return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },

    easeOutExpo: function (pos) {
      return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },

    easeInOutExpo: function (pos) {
      if (pos === 0) {return 0;}
      if (pos === 1) {return 1;}
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(2,10 * (pos - 1));}
      return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },

    easeInCirc: function (pos) {
      return -(Math.sqrt(1 - (pos * pos)) - 1);
    },

    easeOutCirc: function (pos) {
      return Math.sqrt(1 - Math.pow((pos - 1), 2));
    },

    easeInOutCirc: function (pos) {
      if ((pos /= 0.5) < 1) {return -0.5 * (Math.sqrt(1 - pos * pos) - 1);}
      return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    },

    easeOutBounce: function (pos) {
      if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    easeInBack: function (pos) {
      var s = 1.70158;
      return (pos) * pos * ((s + 1) * pos - s);
    },

    easeOutBack: function (pos) {
      var s = 1.70158;
      return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    },

    easeInOutBack: function (pos) {
      var s = 1.70158;
      if ((pos /= 0.5) < 1) {
        return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
      }
      return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    elastic: function (pos) {
      return -1 * Math.pow(4,-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    },

    swingFromTo: function (pos) {
      var s = 1.70158;
      return ((pos /= 0.5) < 1) ?
          0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
          0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    swingFrom: function (pos) {
      var s = 1.70158;
      return pos * pos * ((s + 1) * pos - s);
    },

    swingTo: function (pos) {
      var s = 1.70158;
      return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    },

    bounce: function (pos) {
      if (pos < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    bouncePast: function (pos) {
      if (pos < (1 / 2.75)) {
        return (7.5625 * pos * pos);
      } else if (pos < (2 / 2.75)) {
        return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
      } else if (pos < (2.5 / 2.75)) {
        return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
      } else {
        return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
      }
    },

    easeFromTo: function (pos) {
      if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
      return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
    },

    easeFrom: function (pos) {
      return Math.pow(pos,4);
    },

    easeTo: function (pos) {
      return Math.pow(pos,0.25);
    }
  });

}());


;(function () {
  function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
    var ax = 0,bx = 0,cx = 0,ay = 0,by = 0,cy = 0;
    function sampleCurveX(t) {
      return ((ax * t + bx) * t + cx) * t;
    }
    function sampleCurveY(t) {
      return ((ay * t + by) * t + cy) * t;
    }
    function sampleCurveDerivativeX(t) {
      return (3.0 * ax * t + 2.0 * bx) * t + cx;
    }
    function solveEpsilon(duration) {
      return 1.0 / (200.0 * duration);
    }
    function solve(x,epsilon) {
      return sampleCurveY(solveCurveX(x, epsilon));
    }
    function fabs(n) {
      if (n >= 0) {
        return n;
      } else {
        return 0 - n;
      }
    }
    function solveCurveX(x, epsilon) {
      var t0,t1,t2,x2,d2,i;
      for (t2 = x, i = 0; i < 8; i++) {
        x2 = sampleCurveX(t2) - x;
        if (fabs(x2) < epsilon) {
          return t2;
        }
        d2 = sampleCurveDerivativeX(t2);
        if (fabs(d2) < 1e-6) {
          break;
        }
        t2 = t2 - x2 / d2;
      }
      t0 = 0.0;
      t1 = 1.0;
      t2 = x;
      if (t2 < t0) {
        return t0;
      }
      if (t2 > t1) {
        return t1;
      }
      while (t0 < t1) {
        x2 = sampleCurveX(t2);
        if (fabs(x2 - x) < epsilon) {
          return t2;
        }
        if (x > x2) {
          t0 = t2;
        }else {
          t1 = t2;
        }
        t2 = (t1 - t0) * 0.5 + t0;
      }
      return t2; 
    }
    cx = 3.0 * p1x;
    bx = 3.0 * (p2x - p1x) - cx;
    ax = 1.0 - cx - bx;
    cy = 3.0 * p1y;
    by = 3.0 * (p2y - p1y) - cy;
    ay = 1.0 - cy - by;
    return solve(t, solveEpsilon(duration));
  }
  function getCubicBezierTransition (x1, y1, x2, y2) {
    return function (pos) {
      return cubicBezierAtTime(pos,x1,y1,x2,y2,1);
    };
  }

  Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
    var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
    cubicBezierTransition.displayName = name;
    cubicBezierTransition.x1 = x1;
    cubicBezierTransition.y1 = y1;
    cubicBezierTransition.x2 = x2;
    cubicBezierTransition.y2 = y2;

    return Tweenable.prototype.formula[name] = cubicBezierTransition;
  };


  Tweenable.unsetBezierFunction = function (name) {
    delete Tweenable.prototype.formula[name];
  };

})();

;(function () {

  function getInterpolatedValues (
    from, current, targetState, position, easing, delay) {
    return Tweenable.tweenProps(
      position, current, from, targetState, 1, delay, easing);
  }

  var mockTweenable = new Tweenable();
  mockTweenable._filterArgs = [];

  Tweenable.interpolate = function (
    from, targetState, position, easing, opt_delay) {

    var current = Tweenable.shallowCopy({}, from);
    var delay = opt_delay || 0;
    var easingObject = Tweenable.composeEasingObject(
      from, easing || 'linear');

    mockTweenable.set({});

    var filterArgs = mockTweenable._filterArgs;
    filterArgs.length = 0;
    filterArgs[0] = current;
    filterArgs[1] = from;
    filterArgs[2] = targetState;
    filterArgs[3] = easingObject;

    Tweenable.applyFilter(mockTweenable, 'tweenCreated');
    Tweenable.applyFilter(mockTweenable, 'beforeTween');

    var interpolatedValues = getInterpolatedValues(
      from, current, targetState, position, easingObject, delay);

    Tweenable.applyFilter(mockTweenable, 'afterTween');

    return interpolatedValues;
  };

}());



;(function (Tweenable) {

  var formatManifest;


  var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
  var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
  var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
  var R_RGB = new RegExp(
    'rgb\\(' + R_UNFORMATTED_VALUES.source +
    (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
    (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
  var R_RGB_PREFIX = /^.*\(/;
  var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
  var VALUE_PLACEHOLDER = 'VAL';


  function getFormatChunksFrom (rawValues, prefix) {
    var accumulator = [];

    var rawValuesLength = rawValues.length;
    var i;

    for (i = 0; i < rawValuesLength; i++) {
      accumulator.push('_' + prefix + '_' + i);
    }

    return accumulator;
  }

  function getFormatStringFrom (formattedString) {
    var chunks = formattedString.match(R_FORMAT_CHUNKS);

    if (!chunks) {
      chunks = ['', ''];

    } else if (chunks.length === 1 ||
    formattedString.charAt(0).match(R_NUMBER_COMPONENT)) {
      chunks.unshift('');
    }

    return chunks.join(VALUE_PLACEHOLDER);
  }

  function sanitizeObjectForHexProps (stateObject) {
    Tweenable.each(stateObject, function (prop) {
      var currentProp = stateObject[prop];

      if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
        stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
      }
    });
  }

  function  sanitizeHexChunksToRGB (str) {
    return filterStringChunks(R_HEX, str, convertHexToRGB);
  }

  function convertHexToRGB (hexString) {
    var rgbArr = hexToRGBArray(hexString);
    return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
  }

  var hexToRGBArray_returnArray = [];
  function hexToRGBArray (hex) {

    hex = hex.replace(/#/, '');

    if (hex.length === 3) {
      hex = hex.split('');
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
    hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
    hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

    return hexToRGBArray_returnArray;
  }

  function hexToDec (hex) {
    return parseInt(hex, 16);
  }

  function filterStringChunks (pattern, unfilteredString, filter) {
    var pattenMatches = unfilteredString.match(pattern);
    var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

    if (pattenMatches) {
      var pattenMatchesLength = pattenMatches.length;
      var currentChunk;

      for (var i = 0; i < pattenMatchesLength; i++) {
        currentChunk = pattenMatches.shift();
        filteredString = filteredString.replace(
          VALUE_PLACEHOLDER, filter(currentChunk));
      }
    }

    return filteredString;
  }

  function sanitizeRGBChunks (formattedString) {
    return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
  }

  function sanitizeRGBChunk (rgbChunk) {
    var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
    var numbersLength = numbers.length;
    var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

    for (var i = 0; i < numbersLength; i++) {
      sanitizedString += parseInt(numbers[i], 10) + ',';
    }

    sanitizedString = sanitizedString.slice(0, -1) + ')';

    return sanitizedString;
  }

  function getFormatManifests (stateObject) {
    var manifestAccumulator = {};

    Tweenable.each(stateObject, function (prop) {
      var currentProp = stateObject[prop];

      if (typeof currentProp === 'string') {
        var rawValues = getValuesFrom(currentProp);

        manifestAccumulator[prop] = {
          'formatString': getFormatStringFrom(currentProp)
          ,'chunkNames': getFormatChunksFrom(rawValues, prop)
        };
      }
    });

    return manifestAccumulator;
  }

  function expandFormattedProperties (stateObject, formatManifests) {
    Tweenable.each(formatManifests, function (prop) {
      var currentProp = stateObject[prop];
      var rawValues = getValuesFrom(currentProp);
      var rawValuesLength = rawValues.length;

      for (var i = 0; i < rawValuesLength; i++) {
        stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
      }

      delete stateObject[prop];
    });
  }

  function collapseFormattedProperties (stateObject, formatManifests) {
    Tweenable.each(formatManifests, function (prop) {
      var currentProp = stateObject[prop];
      var formatChunks = extractPropertyChunks(
        stateObject, formatManifests[prop].chunkNames);
      var valuesList = getValuesList(
        formatChunks, formatManifests[prop].chunkNames);
      currentProp = getFormattedValues(
        formatManifests[prop].formatString, valuesList);
      stateObject[prop] = sanitizeRGBChunks(currentProp);
    });
  }

  function extractPropertyChunks (stateObject, chunkNames) {
    var extractedValues = {};
    var currentChunkName, chunkNamesLength = chunkNames.length;

    for (var i = 0; i < chunkNamesLength; i++) {
      currentChunkName = chunkNames[i];
      extractedValues[currentChunkName] = stateObject[currentChunkName];
      delete stateObject[currentChunkName];
    }

    return extractedValues;
  }

  var getValuesList_accumulator = [];
  function getValuesList (stateObject, chunkNames) {
    getValuesList_accumulator.length = 0;
    var chunkNamesLength = chunkNames.length;

    for (var i = 0; i < chunkNamesLength; i++) {
      getValuesList_accumulator.push(stateObject[chunkNames[i]]);
    }

    return getValuesList_accumulator;
  }

  function getFormattedValues (formatString, rawValues) {
    var formattedValueString = formatString;
    var rawValuesLength = rawValues.length;

    for (var i = 0; i < rawValuesLength; i++) {
      formattedValueString = formattedValueString.replace(
        VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
    }

    return formattedValueString;
  }

  function getValuesFrom (formattedString) {
    return formattedString.match(R_UNFORMATTED_VALUES);
  }

  function expandEasingObject (easingObject, tokenData) {
    Tweenable.each(tokenData, function (prop) {
      var currentProp = tokenData[prop];
      var chunkNames = currentProp.chunkNames;
      var chunkLength = chunkNames.length;

      var easing = easingObject[prop];
      var i;

      if (typeof easing === 'string') {
        var easingChunks = easing.split(' ');
        var lastEasingChunk = easingChunks[easingChunks.length - 1];

        for (i = 0; i < chunkLength; i++) {
          easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
        }

      } else {
        for (i = 0; i < chunkLength; i++) {
          easingObject[chunkNames[i]] = easing;
        }
      }

      delete easingObject[prop];
    });
  }

  function collapseEasingObject (easingObject, tokenData) {
    Tweenable.each(tokenData, function (prop) {
      var currentProp = tokenData[prop];
      var chunkNames = currentProp.chunkNames;
      var chunkLength = chunkNames.length;

      var firstEasing = easingObject[chunkNames[0]];
      var typeofEasings = typeof firstEasing;

      if (typeofEasings === 'string') {
        var composedEasingString = '';

        for (var i = 0; i < chunkLength; i++) {
          composedEasingString += ' ' + easingObject[chunkNames[i]];
          delete easingObject[chunkNames[i]];
        }

        easingObject[prop] = composedEasingString.substr(1);
      } else {
        easingObject[prop] = firstEasing;
      }
    });
  }

  Tweenable.prototype.filter.token = {
    'tweenCreated': function (currentState, fromState, toState, easingObject) {
      sanitizeObjectForHexProps(currentState);
      sanitizeObjectForHexProps(fromState);
      sanitizeObjectForHexProps(toState);
      this._tokenData = getFormatManifests(currentState);
    },

    'beforeTween': function (currentState, fromState, toState, easingObject) {
      expandEasingObject(easingObject, this._tokenData);
      expandFormattedProperties(currentState, this._tokenData);
      expandFormattedProperties(fromState, this._tokenData);
      expandFormattedProperties(toState, this._tokenData);
    },

    'afterTween': function (currentState, fromState, toState, easingObject) {
      collapseFormattedProperties(currentState, this._tokenData);
      collapseFormattedProperties(fromState, this._tokenData);
      collapseFormattedProperties(toState, this._tokenData);
      collapseEasingObject(easingObject, this._tokenData);
    }
  };

} (Tweenable));

}).call(null);

},{}]},{},[1]);
