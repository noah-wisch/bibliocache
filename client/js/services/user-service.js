module.exports = {
	name: 'UserService',

	func($http) {
		
		// Store user session info needed for game
		function User(age, genre, readingLevel) {
			this.age = age;
			this.genre = genre;
			this.readingLevel = readingLevel;
			
			return this;
		}
		let user = new User(null, null, null);
		
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

			logOutUser() {
				$http.post('/logout', {});
			},

			getUserInfo() {
				return user;
			},
			
			setGenre(value) {
				user.genre = value;
				$http.post('https://enigmatic-woodland-53824.herokuapp.com/set-category', {
					category: value,
				});
			},

		};
	},

};