const app = angular.module('BibliocacheApp', ['ui.router']).run(function ($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
});

app.config(function($stateProvider) {
	$stateProvider.state({
		name: 'home',
		url: '',
		component: 'newSession',
	});
	
	$stateProvider.state({
		name: 'new-session',
		url: '/new-session', // url: '/new-session/:session_id',
		component: 'newSession',
	});
	
	$stateProvider.state({
		name: 'map',
		url: '/map', // url: '/map/:session_id',
		component: 'map',
	});
	
	$stateProvider.state({
		name: 'in-range',
		url: '/cache', // url: '/cache/:session_id',
		component: 'range',
	});
});


// Controllers
const controllers = [
    require('./controllers/newSession'),
    require('./controllers/map'),
    require('./controllers/range'),
];

for (let i = 0; i < controllers.length; i++) {
    app.controller(controllers[i].name, controllers[i].func);
}


// Components
const components = [
	require('./components/newSession'),
	require('./components/map'),
	require('./components/range'),
];

for(let i=0; i<components.length; i++) {
	app.component(components[i].name, components[i].func);
}


// Services
const services = [
	require ('./services/user-service'),
	require ('./services/location-service'),
	require ('./services/book-service'),
];

for(let i=0; i<services.length; i++) {
	app.factory(services[i].name, services[i].func);
}