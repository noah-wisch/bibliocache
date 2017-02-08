const app = angular.module('BibliocacheApp', ['ui.router']).run(function ($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

/* Routes */
const routes = require('./routes');

app.config($stateProvider => {
	for (let i = 0; i < routes.length; i++) {
		$stateProvider.state(routes[i]);
		console.log('4 Routes Logging?');
	}
});

/* Controllers */
const controllers = [
	require('./controllers/newSession'),
	require('./controllers/map'),
	require('./controllers/range'),
];

for (let i = 0; i < controllers.length; i++) {
	app.controller(controllers[i].name, controllers[i].func);
}

/* Components */
const components = [
	require('./components/newSession'),
	require('./components/map'),
	require('./components/range'),
];

for (let i = 0; i < components.length; i++) {
	app.component(components[i].name, components[i].func);
}

/* Services */
const services = [
	require('./services/user-service'),
	require('./services/book-service'),
	require('./services/location-service'),
];

for (let i = 0; i < services.length; i++) {
	app.factory(services[i].name, services[i].func);
}