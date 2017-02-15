module.exports = {
	name: 'UserService',

	func($http) {
		
		// Store user session info needed for game
		function User(age, category, readingLevel) {
			this.age = age;
			this.category = category;
			this.readingLevel = readingLevel;
			
			return this;
		}
		let user = new User(null, null, null);
		
		return {
			registerUser(user) {
				return $http.post('/registration', user);
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
				return {
					email: null,
					password: null,
				};
			},

			getUserInfo() {
				return user;
			},

		};
	},

};