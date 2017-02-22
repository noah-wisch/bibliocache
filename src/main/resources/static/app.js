"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    var app = angular.module('BibliocacheApp', ['ui.router', 'ngMessages']).run(function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    });

    var routes = require('./routes');

    app.config(function ($stateProvider) {
      for (var i = 0; i < routes.length; i++) {
        $stateProvider.state(routes[i]);
      }
    });

    var controllers = [require('./controllers/registration'), require('./controllers/login'), require('./controllers/newSession'), require('./controllers/map'), require('./controllers/endSession')];

    for (var i = 0; i < controllers.length; i++) {
      app.controller(controllers[i].name, controllers[i].func);
    }

    var components = [require('./components/registration'), require('./components/login'), require('./components/newSession'), require('./components/map'), require('./components/endSession'), require('./components/header'), require('./components/footer')];

    for (var _i = 0; _i < components.length; _i++) {
      app.component(components[_i].name, components[_i].func);
    }

    var services = [require('./services/user-service'), require('./services/book-service'), require('./services/location-service')];

    for (var _i2 = 0; _i2 < services.length; _i2++) {
      app.factory(services[_i2].name, services[_i2].func);
    }
  }, { "./components/endSession": 2, "./components/footer": 3, "./components/header": 4, "./components/login": 5, "./components/map": 6, "./components/newSession": 7, "./components/registration": 8, "./controllers/endSession": 9, "./controllers/login": 10, "./controllers/map": 11, "./controllers/newSession": 12, "./controllers/registration": 13, "./routes": 14, "./services/book-service": 15, "./services/location-service": 16, "./services/user-service": 17 }], 2: [function (require, module, exports) {
    module.exports = {
      name: 'endSession',
      func: {
        templateUrl: 'templates/endSession.html'
      }
    };
  }, {}], 3: [function (require, module, exports) {
    module.exports = {
      name: 'bibFooter',
      func: {
        templateUrl: 'templates/footer.html'
      }
    };
  }, {}], 4: [function (require, module, exports) {
    module.exports = {
      name: 'bibHeader',
      func: {
        templateUrl: 'templates/header.html'
      }
    };
  }, {}], 5: [function (require, module, exports) {
    module.exports = {
      name: 'login',
      func: {
        templateUrl: 'templates/userLogin.html'
      }
    };
  }, {}], 6: [function (require, module, exports) {
    module.exports = {
      name: 'map',
      func: {
        templateUrl: 'templates/map.html'
      }
    };
  }, {}], 7: [function (require, module, exports) {
    module.exports = {
      name: 'newSession',
      func: {
        templateUrl: 'templates/newSession.html'
      }
    };
  }, {}], 8: [function (require, module, exports) {
    module.exports = {
      name: 'registration',
      func: {
        templateUrl: 'templates/userRegistration.html'
      }
    };
  }, {}], 9: [function (require, module, exports) {
    module.exports = {
      name: 'EndSessionController',
      func: function func($scope, $state, BookService, UserService) {

        var haveCode = false;
        $scope.codes = BookService.getBooks();

        $scope.submitCodeChoice = function () {
          haveCode = true;
          console.log('I choose you, Pikachu!');
        };

        $scope.playAgain = function () {
          $state.go('new-session');
        };

        $scope.logOut = function () {
          console.log('logging out');
          $http.post('/logout', {});
        };
      }
    };
  }, {}], 10: [function (require, module, exports) {
    module.exports = {
      name: 'LoginController',

      func: function func($scope, $state, UserService) {
        $scope.email = '';
        $scope.password = '';

        $scope.loginToAccount = function (email, password) {
          var user = {
            email: email,
            password: password
          };

          UserService.logInUser(user);
        };
      }
    };
  }, {}], 11: [function (require, module, exports) {
    module.exports = {
      name: 'MapController',
      func: function func($scope, $state, LocationService, BookService) {


        var userPos = LocationService.getUserLocation();
        var endPos = LocationService.getDestination();

        if (userPos.length === 0) {
          $state.go('new-session');
        }

        var Map = void 0,
            userMarker = void 0,
            userRadius = void 0;
        var currentPos = new google.maps.LatLng(userPos[0], userPos[1]);
        var destination = new google.maps.LatLng(endPos[0], endPos[1]);
        var destRange = void 0;
        var destRadius = 50; 

        var geo = navigator.geolocation;
        var watch_id = void 0;

        function initMap() {

          var styledMapType = new google.maps.StyledMapType([{ "stylers": [{ "hue": "#16A085" }, { "saturation": 0 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }], { name: 'Styled Map' });

          Map = new google.maps.Map(document.querySelector('#sessionMap'), {
            zoom: 15,
            center: currentPos,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE
            }
          });

          Map.mapTypes.set('styled_map', styledMapType);
          Map.setMapTypeId('styled_map');

          var rendererOptions = {
            map: Map,
            suppressMarkers: true
          };
          var directionsService = new google.maps.DirectionsService();
          var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

          directionsDisplay.setMap(Map);
          directionsDisplay.setPanel(document.querySelector('#directions'));
          directionsDisplay.setOptions({
            polylineOptions: {
              strokeColor: '#581845'
            }
          });

          function createMarker(position, icon) {
            var marker = new google.maps.Marker({
              position: position,
              map: Map,
              icon: icon
            });
          }

          function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            directionsService.route({
              origin: currentPos,
              destination: destination,
              travelMode: 'WALKING'
            }, function (response, status) {
              if (status === 'OK') {
                var route = response.routes[0].legs[0];
                createMarker(route.end_location, 'assets/endMarker.png');
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
          };
          calculateAndDisplayRoute(directionsService, directionsDisplay);

          userMarker = new google.maps.Marker({
            position: currentPos,
            map: Map,
            icon: "assets/user.png"
          });

          userRadius = new google.maps.Circle({
            strokeColor: '#581845',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#581845',
            fillOpacity: 0.4,
            map: Map,
            center: currentPos,
            radius: 50
          });

          destRange = new google.maps.Circle({
            strokeColor: 'black',
            strokeOpacity: 0,
            fillColor: 'black',
            fillOpacity: 0,
            map: Map,
            center: destination,
            radius: destRadius
          });
        };
        initMap();

        function watchUserPos() {

          function watch_success(pos) {
            console.log("new position: " + pos.coords.latitude + ", " + pos.coords.longitude);

            currentPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            userMarker.setPosition(currentPos);
            userRadius.setCenter(currentPos);

            var destBounds = destRange.getBounds();
            var userInRange = google.maps.geometry.spherical.computeDistanceBetween(destination, currentPos) <= destRadius;

            console.log(userInRange);
            if (userInRange) {
              geo.clearWatch(watch_id);
              BookService.requestBooks().then(function () {
                $state.go('end-session');
              });
            }
          };

          function watch_error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
          }

          var watch_options = {
            enableHighAccuracy: true,
            maximumAge: 3000, 
            timeout: 5000
          };

          if (navigator.geolocation) {
            watch_id = geo.watchPosition(watch_success, watch_error, watch_options);
          } else {
            console.log('error');
          }
        };

        if ("geolocation" in navigator) {
          watchUserPos();
        } else {
          alert("Geolocation services are not supported by your browser.");
        }
      }
    };
  }, {}], 12: [function (require, module, exports) {
    module.exports = {
      name: 'NewSessionController',
      func: function func($scope, $state, $interval, UserService, LocationService, BookService) {

        var haveGenre = false;
        var haveLocation = false;
        var haveDestination = false;

        $scope.genres = BookService.getAllGenres(); 

        $scope.submitGenre = function (genre) {
          UserService.setGenre(genre);
          haveGenre = true;

          var ProgressBar = require('progressbar.js');
          var bar = new ProgressBar.Line(loadingBar, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 5500,
            color: '#4E978A',
            trailColor: '#581845',
            trailWidth: 1,
            svgStyle: { width: '100%', height: '100%' },
            from: { color: '#A3E6D9' },
            to: { color: '#4E978A' },
            step: function step(state, bar) {
              bar.path.setAttribute('stroke', state.color);
            }
          });
          bar.animate(1.0);
        };

        $scope.displayAddressField = false;

        function initPlacesAutocomplete() {
          var input = document.querySelector('#pac-input');

          var autocomplete = new google.maps.places.Autocomplete(input);
          var infowindow = new google.maps.InfoWindow();
          var infowindowContent = document.querySelector('#infowindow-content');
          infowindow.setContent(infowindowContent);

          autocomplete.addListener('place_changed', function () {
            infowindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
              window.alert("No details available for input: '" + place.name + "'");
              return;
            }

            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();
            LocationService.updateUserLocation(lat, lng);
            haveLocation = true;

            var address = '';
            if (place.address_components) {
              address = [place.address_components[0] && place.address_components[0].short_name || '', place.address_components[1] && place.address_components[1].short_name || '', place.address_components[2] && place.address_components[2].short_name || ''].join(' ');
            }

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
          });
        }

        function getUserLocation() {

          var geo = navigator.geolocation;

          function geo_success(position) {
            var pos = position.coords;
            console.log("current position: [" + pos.latitude + ", " + pos.longitude + "]");

            LocationService.updateUserLocation(pos.latitude, pos.longitude);
            haveLocation = true;

            getUserDestination();
          };

          function geo_error(err) {
            console.log("ERROR(" + err.code + "): " + err.message);
            $scope.displayAddressField = true;
            initPlacesAutocomplete();
            getUserDestination();
          };

          var geo_options = {
            timeout: 5000
          };

          geo.getCurrentPosition(geo_success, geo_error, geo_options);
        };

        function getUserDestination() {
          var age = UserService.getUserInfo.age;
          var range = void 0;
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

        var wait = void 0;

        function checkForData() {
          wait = $interval(startGame, 1000);
        };

        function stopChecking() {
          $interval.cancel(wait);
        };

        checkForData();
      }
    };
  }, { "progressbar.js": 20 }], 13: [function (require, module, exports) {
    module.exports = {
      name: 'RegistrationController',

      func: function func($scope, $state, UserService) {
        $scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        $scope.password = '';
        $scope.passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/;

        $scope.readingLevelValidation = /^[0-9]+$/;
        $scope.ageValidation = /^[0-9]+$/;

        $scope.form = {
          readingLevel: null,
          age: null
        };

        $scope.createAccount = function (email, password, readingLevel, age) {

          var user = {
            age: age,
            category: null,
            email: email,
            location: [0, 0], 
            password: password,
            readingLevel: readingLevel
          };

          UserService.registerUser(user);
        };
      }
    };
  }, {}], 14: [function (require, module, exports) {
    module.exports = [{
      name: 'registration',
      url: '/register',
      component: 'registration'
    }, {
      name: 'login',
      url: '/login',
      component: 'login'
    }, {
      name: 'new-session',
      url: '/new-session',
      component: 'newSession'
    }, {
      name: 'map',
      url: '/map',
      component: 'map'
    }, {
      name: 'end-session',
      url: '/books',
      component: 'endSession'
    }];
  }, {}], 15: [function (require, module, exports) {
    module.exports = {
      name: 'BookService',

      func: function func($http) {
        var genres = ['Biography', 'Comedy', 'History', 'Poetry', 'Romance', 'Science Fiction', 'Fantasy', 'Thrillers', 'Suspense', 'Young Adult'];

        var bookList = [];

        var codes = ['url1', 'url2', 'url3', 'url4', 'url5'];

        return {
          getAllGenres: function getAllGenres() {
            return genres;
          },
          requestBooks: function requestBooks() {
            return $http.post('/end-round', {}).then(function (response) {
              console.log('the book list is:');
              console.log(response);
            });
          },
          getBooks: function getBooks() {
            return bookList;
          }
        };
      }
    };
  }, {}], 16: [function (require, module, exports) {
    module.exports = {
      name: 'LocationService',

      func: function func($http) {
        var currentPos = [];
        var endPos = [];

        return {
          getUserLocation: function getUserLocation() {
            return currentPos;
          },
          updateUserLocation: function updateUserLocation(lat, lng) {
            currentPos = [lat, lng];
            return currentPos;
          },
          setDestination: function setDestination(maxRange) {
            var latRange = maxRange * 0.015; 
            var lngRange = maxRange * 0.019; 


            var latDest = currentPos[0] + (Math.random() - 0.5) * latRange;
            var lngDest = currentPos[1] + (Math.random() - 0.5) * lngRange;

            console.log('destination: [' + latDest, lngDest + ']');
            endPos = [latDest, lngDest];
            return endPos;
          },
          getDestination: function getDestination() {
            return endPos;
          }
        };
      }
    };
  }, {}], 17: [function (require, module, exports) {
    module.exports = {
      name: 'UserService',

      func: function func($http) {
        function User(age, genre, readingLevel) {
          this.age = age;
          this.genre = genre;
          this.readingLevel = readingLevel;

          return this;
        }
        var user = new User(null, null, null);

        return {
          getUserInfo: function getUserInfo() {
            return user;
          },
          setGenre: function setGenre(value) {
            user.genre = value;
            $http.post('/set-category', {
              category: value
            });
          }
        };
      }
    };
  }, {}], 18: [function (require, module, exports) {

    var Shape = require('./shape');
    var utils = require('./utils');

    var Circle = function Circle(container, options) {
      this._pathTemplate = 'M 50,50 m 0,-{radius}' + ' a {radius},{radius} 0 1 1 0,{2radius}' + ' a {radius},{radius} 0 1 1 0,-{2radius}';

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
  }, { "./shape": 23, "./utils": 24 }], 19: [function (require, module, exports) {

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
  }, { "./shape": 23, "./utils": 24 }], 20: [function (require, module, exports) {
    module.exports = {
      Line: require('./line'),
      Circle: require('./circle'),
      SemiCircle: require('./semicircle'),

      Path: require('./path'),

      Shape: require('./shape'),

      utils: require('./utils')
    };
  }, { "./circle": 18, "./line": 19, "./path": 21, "./semicircle": 22, "./shape": 23, "./utils": 24 }], 21: [function (require, module, exports) {

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
        step: function step() {}
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
        step: function step(state) {
          self.path.style.strokeDashoffset = state.offset;
          var reference = opts.shape || self;
          opts.step(state, reference, opts.attachment);
        },
        finish: function finish(state) {
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
  }, { "./utils": 24, "shifty": 25 }], 22: [function (require, module, exports) {

    var Shape = require('./shape');
    var Circle = require('./circle');
    var utils = require('./utils');

    var SemiCircle = function SemiCircle(container, options) {
      this._pathTemplate = 'M 50,50 m -{radius},0' + ' a {radius},{radius} 0 1 1 {2radius},0';

      this.containerAspectRatio = 2;

      Shape.apply(this, arguments);
    };

    SemiCircle.prototype = new Shape();
    SemiCircle.prototype.constructor = SemiCircle;

    SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
      svg.setAttribute('viewBox', '0 0 100 50');
    };

    SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(opts, container, textContainer) {
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
  }, { "./circle": 18, "./shape": 23, "./utils": 24 }], 23: [function (require, module, exports) {

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

    Shape.prototype._initializeTextContainer = function (opts, container, element) {
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
        console.warn('Incorrect aspect ratio of container', '#' + container.id, 'detected:', computedStyle.getPropertyValue('width') + '(width)', '/', computedStyle.getPropertyValue('height') + '(height)', '=', width / height);

        console.warn('Aspect ratio of should be', this.containerAspectRatio);
      }
    };

    module.exports = Shape;
  }, { "./path": 21, "./utils": 24 }], 24: [function (require, module, exports) {

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
      forEachObject(styles, function (styleValue, styleName) {
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

      var type = typeof obj === "undefined" ? "undefined" : _typeof(obj);
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
  }, {}], 25: [function (require, module, exports) {
    ;(function () {
      var root = this || Function('return this')();


      var Tweenable = function () {

        'use strict';


        var formula;

        var DEFAULT_SCHEDULE_FUNCTION;
        var DEFAULT_EASING = 'linear';
        var DEFAULT_DURATION = 500;
        var UPDATE_TIME = 1000 / 60;

        var _now = Date.now ? Date.now : function () {
          return +new Date();
        };

        var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;

        if (typeof window !== 'undefined') {
          DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame || setTimeout;
        } else {
          DEFAULT_SCHEDULE_FUNCTION = setTimeout;
        }

        function noop() {}


        function each(obj, fn) {
          var key;
          for (key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
              fn(key);
            }
          }
        }

        function shallowCopy(targetObj, srcObj) {
          each(srcObj, function (prop) {
            targetObj[prop] = srcObj[prop];
          });

          return targetObj;
        }

        function defaults(target, src) {
          each(src, function (prop) {
            if (typeof target[prop] === 'undefined') {
              target[prop] = src[prop];
            }
          });
        }

        function tweenProps(forPosition, currentState, originalState, targetState, duration, timestamp, easing) {
          var normalizedPosition = forPosition < timestamp ? 0 : (forPosition - timestamp) / duration;

          var prop;
          var easingObjectProp;
          var easingFn;
          for (prop in currentState) {
            if (currentState.hasOwnProperty(prop)) {
              easingObjectProp = easing[prop];
              easingFn = typeof easingObjectProp === 'function' ? easingObjectProp : formula[easingObjectProp];

              currentState[prop] = tweenProp(originalState[prop], targetState[prop], easingFn, normalizedPosition);
            }
          }

          return currentState;
        }

        function tweenProp(start, end, easingFunc, position) {
          return start + (end - start) * easingFunc(position);
        }

        function applyFilter(tweenable, filterName) {
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
        function timeoutHandler(tweenable, timestamp, delay, duration, currentState, originalState, targetState, easing, step, schedule, opt_currentTimeOverride) {

          timeoutHandler_endTime = timestamp + delay + duration;

          timeoutHandler_currentTime = Math.min(opt_currentTimeOverride || now(), timeoutHandler_endTime);

          timeoutHandler_isEnded = timeoutHandler_currentTime >= timeoutHandler_endTime;

          timeoutHandler_offset = duration - (timeoutHandler_endTime - timeoutHandler_currentTime);

          if (tweenable.isPlaying()) {
            if (timeoutHandler_isEnded) {
              step(targetState, tweenable._attachment, timeoutHandler_offset);
              tweenable.stop(true);
            } else {
              tweenable._scheduleId = schedule(tweenable._timeoutHandler, UPDATE_TIME);

              applyFilter(tweenable, 'beforeTween');

              if (timeoutHandler_currentTime < timestamp + delay) {
                tweenProps(1, currentState, originalState, targetState, 1, 1, easing);
              } else {
                tweenProps(timeoutHandler_currentTime, currentState, originalState, targetState, duration, timestamp + delay, easing);
              }

              applyFilter(tweenable, 'afterTween');

              step(currentState, tweenable._attachment, timeoutHandler_offset);
            }
          }
        }

        function composeEasingObject(fromTweenParams, easing) {
          var composedEasing = {};
          var typeofEasing = typeof easing === "undefined" ? "undefined" : _typeof(easing);

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

        function Tweenable(opt_initialState, opt_config) {
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
            timeoutHandler(self, self._timestamp, self._delay, self._duration, self._currentState, self._originalState, self._targetState, self._easing, self._step, self._scheduleFunction);
          };

          var currentState = this._currentState;
          var targetState = this._targetState;

          defaults(targetState, currentState);

          this._easing = composeEasingObject(currentState, config.easing || DEFAULT_EASING);

          this._filterArgs = [currentState, this._originalState, targetState, this._easing];

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

          if (this._timestamp + millisecond === 0) {
            return this;
          }

          this._timestamp = currentTime - millisecond;

          if (!this.isPlaying()) {
            this._isTweening = true;
            this._isPaused = false;

            timeoutHandler(this, this._timestamp, this._delay, this._duration, this._currentState, this._originalState, this._targetState, this._easing, this._step, this._scheduleFunction, currentTime);

            this.pause();
          }

          return this;
        };

        Tweenable.prototype.stop = function (gotoEnd) {
          this._isTweening = false;
          this._isPaused = false;
          this._timeoutHandler = noop;

          (root.cancelAnimationFrame || root.webkitCancelAnimationFrame || root.oCancelAnimationFrame || root.msCancelAnimationFrame || root.mozCancelRequestAnimationFrame || root.clearTimeout)(this._scheduleId);

          if (gotoEnd) {
            applyFilter(this, 'beforeTween');
            tweenProps(1, this._currentState, this._originalState, this._targetState, 1, 0, this._easing);
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
          linear: function linear(pos) {
            return pos;
          }
        };

        formula = Tweenable.prototype.formula;

        shallowCopy(Tweenable, {
          'now': now,
          'each': each,
          'tweenProps': tweenProps,
          'tweenProp': tweenProp,
          'applyFilter': applyFilter,
          'shallowCopy': shallowCopy,
          'defaults': defaults,
          'composeEasingObject': composeEasingObject
        });


        if (typeof SHIFTY_DEBUG_NOW === 'function') {
          root.timeoutHandler = timeoutHandler;
        }

        if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
          module.exports = Tweenable;
        } else if (typeof define === 'function' && define.amd) {
          define(function () {
            return Tweenable;
          });
        } else if (typeof root.Tweenable === 'undefined') {
          root.Tweenable = Tweenable;
        }

        return Tweenable;
      }();



      ;(function () {

        Tweenable.shallowCopy(Tweenable.prototype.formula, {
          easeInQuad: function easeInQuad(pos) {
            return Math.pow(pos, 2);
          },

          easeOutQuad: function easeOutQuad(pos) {
            return -(Math.pow(pos - 1, 2) - 1);
          },

          easeInOutQuad: function easeInOutQuad(pos) {
            if ((pos /= 0.5) < 1) {
              return 0.5 * Math.pow(pos, 2);
            }
            return -0.5 * ((pos -= 2) * pos - 2);
          },

          easeInCubic: function easeInCubic(pos) {
            return Math.pow(pos, 3);
          },

          easeOutCubic: function easeOutCubic(pos) {
            return Math.pow(pos - 1, 3) + 1;
          },

          easeInOutCubic: function easeInOutCubic(pos) {
            if ((pos /= 0.5) < 1) {
              return 0.5 * Math.pow(pos, 3);
            }
            return 0.5 * (Math.pow(pos - 2, 3) + 2);
          },

          easeInQuart: function easeInQuart(pos) {
            return Math.pow(pos, 4);
          },

          easeOutQuart: function easeOutQuart(pos) {
            return -(Math.pow(pos - 1, 4) - 1);
          },

          easeInOutQuart: function easeInOutQuart(pos) {
            if ((pos /= 0.5) < 1) {
              return 0.5 * Math.pow(pos, 4);
            }
            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
          },

          easeInQuint: function easeInQuint(pos) {
            return Math.pow(pos, 5);
          },

          easeOutQuint: function easeOutQuint(pos) {
            return Math.pow(pos - 1, 5) + 1;
          },

          easeInOutQuint: function easeInOutQuint(pos) {
            if ((pos /= 0.5) < 1) {
              return 0.5 * Math.pow(pos, 5);
            }
            return 0.5 * (Math.pow(pos - 2, 5) + 2);
          },

          easeInSine: function easeInSine(pos) {
            return -Math.cos(pos * (Math.PI / 2)) + 1;
          },

          easeOutSine: function easeOutSine(pos) {
            return Math.sin(pos * (Math.PI / 2));
          },

          easeInOutSine: function easeInOutSine(pos) {
            return -0.5 * (Math.cos(Math.PI * pos) - 1);
          },

          easeInExpo: function easeInExpo(pos) {
            return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
          },

          easeOutExpo: function easeOutExpo(pos) {
            return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
          },

          easeInOutExpo: function easeInOutExpo(pos) {
            if (pos === 0) {
              return 0;
            }
            if (pos === 1) {
              return 1;
            }
            if ((pos /= 0.5) < 1) {
              return 0.5 * Math.pow(2, 10 * (pos - 1));
            }
            return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
          },

          easeInCirc: function easeInCirc(pos) {
            return -(Math.sqrt(1 - pos * pos) - 1);
          },

          easeOutCirc: function easeOutCirc(pos) {
            return Math.sqrt(1 - Math.pow(pos - 1, 2));
          },

          easeInOutCirc: function easeInOutCirc(pos) {
            if ((pos /= 0.5) < 1) {
              return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
          },

          easeOutBounce: function easeOutBounce(pos) {
            if (pos < 1 / 2.75) {
              return 7.5625 * pos * pos;
            } else if (pos < 2 / 2.75) {
              return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
            } else if (pos < 2.5 / 2.75) {
              return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
            } else {
              return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
            }
          },

          easeInBack: function easeInBack(pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s);
          },

          easeOutBack: function easeOutBack(pos) {
            var s = 1.70158;
            return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
          },

          easeInOutBack: function easeInOutBack(pos) {
            var s = 1.70158;
            if ((pos /= 0.5) < 1) {
              return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
            }
            return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
          },

          elastic: function elastic(pos) {
            return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
          },

          swingFromTo: function swingFromTo(pos) {
            var s = 1.70158;
            return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
          },

          swingFrom: function swingFrom(pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s);
          },

          swingTo: function swingTo(pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
          },

          bounce: function bounce(pos) {
            if (pos < 1 / 2.75) {
              return 7.5625 * pos * pos;
            } else if (pos < 2 / 2.75) {
              return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
            } else if (pos < 2.5 / 2.75) {
              return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
            } else {
              return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
            }
          },

          bouncePast: function bouncePast(pos) {
            if (pos < 1 / 2.75) {
              return 7.5625 * pos * pos;
            } else if (pos < 2 / 2.75) {
              return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
            } else if (pos < 2.5 / 2.75) {
              return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
            } else {
              return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
            }
          },

          easeFromTo: function easeFromTo(pos) {
            if ((pos /= 0.5) < 1) {
              return 0.5 * Math.pow(pos, 4);
            }
            return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
          },

          easeFrom: function easeFrom(pos) {
            return Math.pow(pos, 4);
          },

          easeTo: function easeTo(pos) {
            return Math.pow(pos, 0.25);
          }
        });
      })();


      ;(function () {
        function cubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
          var ax = 0,
              bx = 0,
              cx = 0,
              ay = 0,
              by = 0,
              cy = 0;
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
          function solve(x, epsilon) {
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
            var t0, t1, t2, x2, d2, i;
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
              } else {
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
        function getCubicBezierTransition(x1, y1, x2, y2) {
          return function (pos) {
            return cubicBezierAtTime(pos, x1, y1, x2, y2, 1);
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

        function getInterpolatedValues(from, current, targetState, position, easing, delay) {
          return Tweenable.tweenProps(position, current, from, targetState, 1, delay, easing);
        }

        var mockTweenable = new Tweenable();
        mockTweenable._filterArgs = [];

        Tweenable.interpolate = function (from, targetState, position, easing, opt_delay) {

          var current = Tweenable.shallowCopy({}, from);
          var delay = opt_delay || 0;
          var easingObject = Tweenable.composeEasingObject(from, easing || 'linear');

          mockTweenable.set({});

          var filterArgs = mockTweenable._filterArgs;
          filterArgs.length = 0;
          filterArgs[0] = current;
          filterArgs[1] = from;
          filterArgs[2] = targetState;
          filterArgs[3] = easingObject;

          Tweenable.applyFilter(mockTweenable, 'tweenCreated');
          Tweenable.applyFilter(mockTweenable, 'beforeTween');

          var interpolatedValues = getInterpolatedValues(from, current, targetState, position, easingObject, delay);

          Tweenable.applyFilter(mockTweenable, 'afterTween');

          return interpolatedValues;
        };
      })();



      ;(function (Tweenable) {

        var formatManifest;


        var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
        var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
        var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
        var R_RGB = new RegExp('rgb\\(' + R_UNFORMATTED_VALUES.source + /,\s*/.source + R_UNFORMATTED_VALUES.source + /,\s*/.source + R_UNFORMATTED_VALUES.source + '\\)', 'g');
        var R_RGB_PREFIX = /^.*\(/;
        var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
        var VALUE_PLACEHOLDER = 'VAL';


        function getFormatChunksFrom(rawValues, prefix) {
          var accumulator = [];

          var rawValuesLength = rawValues.length;
          var i;

          for (i = 0; i < rawValuesLength; i++) {
            accumulator.push('_' + prefix + '_' + i);
          }

          return accumulator;
        }

        function getFormatStringFrom(formattedString) {
          var chunks = formattedString.match(R_FORMAT_CHUNKS);

          if (!chunks) {
            chunks = ['', ''];

          } else if (chunks.length === 1 ||
          formattedString.charAt(0).match(R_NUMBER_COMPONENT)) {
            chunks.unshift('');
          }

          return chunks.join(VALUE_PLACEHOLDER);
        }

        function sanitizeObjectForHexProps(stateObject) {
          Tweenable.each(stateObject, function (prop) {
            var currentProp = stateObject[prop];

            if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
              stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
            }
          });
        }

        function sanitizeHexChunksToRGB(str) {
          return filterStringChunks(R_HEX, str, convertHexToRGB);
        }

        function convertHexToRGB(hexString) {
          var rgbArr = hexToRGBArray(hexString);
          return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
        }

        var hexToRGBArray_returnArray = [];
        function hexToRGBArray(hex) {

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

        function hexToDec(hex) {
          return parseInt(hex, 16);
        }

        function filterStringChunks(pattern, unfilteredString, filter) {
          var pattenMatches = unfilteredString.match(pattern);
          var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

          if (pattenMatches) {
            var pattenMatchesLength = pattenMatches.length;
            var currentChunk;

            for (var i = 0; i < pattenMatchesLength; i++) {
              currentChunk = pattenMatches.shift();
              filteredString = filteredString.replace(VALUE_PLACEHOLDER, filter(currentChunk));
            }
          }

          return filteredString;
        }

        function sanitizeRGBChunks(formattedString) {
          return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
        }

        function sanitizeRGBChunk(rgbChunk) {
          var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
          var numbersLength = numbers.length;
          var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

          for (var i = 0; i < numbersLength; i++) {
            sanitizedString += parseInt(numbers[i], 10) + ',';
          }

          sanitizedString = sanitizedString.slice(0, -1) + ')';

          return sanitizedString;
        }

        function getFormatManifests(stateObject) {
          var manifestAccumulator = {};

          Tweenable.each(stateObject, function (prop) {
            var currentProp = stateObject[prop];

            if (typeof currentProp === 'string') {
              var rawValues = getValuesFrom(currentProp);

              manifestAccumulator[prop] = {
                'formatString': getFormatStringFrom(currentProp),
                'chunkNames': getFormatChunksFrom(rawValues, prop)
              };
            }
          });

          return manifestAccumulator;
        }

        function expandFormattedProperties(stateObject, formatManifests) {
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

        function collapseFormattedProperties(stateObject, formatManifests) {
          Tweenable.each(formatManifests, function (prop) {
            var currentProp = stateObject[prop];
            var formatChunks = extractPropertyChunks(stateObject, formatManifests[prop].chunkNames);
            var valuesList = getValuesList(formatChunks, formatManifests[prop].chunkNames);
            currentProp = getFormattedValues(formatManifests[prop].formatString, valuesList);
            stateObject[prop] = sanitizeRGBChunks(currentProp);
          });
        }

        function extractPropertyChunks(stateObject, chunkNames) {
          var extractedValues = {};
          var currentChunkName,
              chunkNamesLength = chunkNames.length;

          for (var i = 0; i < chunkNamesLength; i++) {
            currentChunkName = chunkNames[i];
            extractedValues[currentChunkName] = stateObject[currentChunkName];
            delete stateObject[currentChunkName];
          }

          return extractedValues;
        }

        var getValuesList_accumulator = [];
        function getValuesList(stateObject, chunkNames) {
          getValuesList_accumulator.length = 0;
          var chunkNamesLength = chunkNames.length;

          for (var i = 0; i < chunkNamesLength; i++) {
            getValuesList_accumulator.push(stateObject[chunkNames[i]]);
          }

          return getValuesList_accumulator;
        }

        function getFormattedValues(formatString, rawValues) {
          var formattedValueString = formatString;
          var rawValuesLength = rawValues.length;

          for (var i = 0; i < rawValuesLength; i++) {
            formattedValueString = formattedValueString.replace(VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
          }

          return formattedValueString;
        }

        function getValuesFrom(formattedString) {
          return formattedString.match(R_UNFORMATTED_VALUES);
        }

        function expandEasingObject(easingObject, tokenData) {
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

        function collapseEasingObject(easingObject, tokenData) {
          Tweenable.each(tokenData, function (prop) {
            var currentProp = tokenData[prop];
            var chunkNames = currentProp.chunkNames;
            var chunkLength = chunkNames.length;

            var firstEasing = easingObject[chunkNames[0]];
            var typeofEasings = typeof firstEasing === "undefined" ? "undefined" : _typeof(firstEasing);

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
          'tweenCreated': function tweenCreated(currentState, fromState, toState, easingObject) {
            sanitizeObjectForHexProps(currentState);
            sanitizeObjectForHexProps(fromState);
            sanitizeObjectForHexProps(toState);
            this._tokenData = getFormatManifests(currentState);
          },

          'beforeTween': function beforeTween(currentState, fromState, toState, easingObject) {
            expandEasingObject(easingObject, this._tokenData);
            expandFormattedProperties(currentState, this._tokenData);
            expandFormattedProperties(fromState, this._tokenData);
            expandFormattedProperties(toState, this._tokenData);
          },

          'afterTween': function afterTween(currentState, fromState, toState, easingObject) {
            collapseFormattedProperties(currentState, this._tokenData);
            collapseFormattedProperties(fromState, this._tokenData);
            collapseFormattedProperties(toState, this._tokenData);
            collapseEasingObject(easingObject, this._tokenData);
          }
        };
      })(Tweenable);
    }).call(null);
  }, {}] }, {}, [1]);