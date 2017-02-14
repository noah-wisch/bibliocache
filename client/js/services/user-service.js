module.exports = {
	name: 'UserService',

	func($http) {
		return {
			registerUser(user) {
				return $http.post('/registration', user);
				console.log('posting new user');
				return {
					email: null,
    				password: null,
					readingLevel: null,
					// category: null,
					// location: null,
					age: null,
				};
			},

			logInUser(user) {
				return $http.post('/login', user);
				console.log('posting existing user');
				return {
					email: null,
					password: null,
				};
			},

			newSession() {
				console.log('new session');
			},

		};
	},

};