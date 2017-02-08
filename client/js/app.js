const app = angular.module('BibliocacheApp', ['ui.router']);

// Routes
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
		component: 'showMap',
	});
	
	$stateProvider.state({
		name: 'on-site',
		url: '/cache', // url: '/cache/:session_id',
		component: 'onSite',
	});
});


// Controllers
const controllers = [
	require ('./controllers/new-session'),
	require ('./controllers/show-map'),
	require ('./controllers/on-site'),
];

for(let i=0; i<controllers.length; i++) {
	app.controller(controllers[i].name, controllers[i].func);
}


// Components
const components = [
	require('./components/new-session'),
	require('./components/show-map'),
	require('./components/on-site'),
];

for(let i=0; i<components.length; i++) {
	app.component(components[i].name, components[i].func);
}


// Services
const services = [
	require ('./services/user-service'),
];

for(let i=0; i<services.length; i++) {
	app.factory(services[i].name, services[i].func);
}
