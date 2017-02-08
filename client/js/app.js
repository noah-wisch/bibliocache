const app = angular.module('BibliocacheApp', ['ui.router']);

const controllers = [
    require('./controllers/newSession'),
    require('./controllers/map'),
    require('./controllers/range'),
];

for (let i = 0; i < controllers.length; i++) {
    app.controller(controllers[i].name, controllers[i].func);
}

// const services = [
//     require('./services/#'),
//     require('./services/#'),
// ];

// for (let i = 0; i < services.length; i++) {
//     app.factory(services[i].name, services[i].func);
// };

app.config(function($stateProvider) {
	
});
