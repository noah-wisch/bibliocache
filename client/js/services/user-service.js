module.exports = {
	name: 'UserService',

	func($http) {
		return {
			registerUser(user) {
				return $http.post('/registration', user);
				console.log('posting new user');
				return {
					age: user.age,
					category: 'Horror', // hardcoded for now
					email: user.email,
					location: [0, 0], // hardcoded for now
					password: user.password,
					readingLevel: user.readingLevel,
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