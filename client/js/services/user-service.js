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
		//let user = new User(null, null, null);
		let user = new User(30, 'Horror', 14);
		
		return {
			registerUser(newUser) {
				user.age = newUser.age;
				user.genre = newUser.category;
				user.readingLevel = newUser.readingLevel;
				
				return $http.post('/registration', newUser);
			},

			logInUser(user) {
				// get user info from server to update user constructor
				//
				// DO THINGS HERE
				return $http.post('/login', user);
			},

			logOut(user) {
				return $http.post('/logout', user);
			},

			getUserInfo() {
				return user;
			},
			
			setGenre(value) {
				user.genre = value;
				console.log(user.genre);
				$http.post('https://enigmatic-woodland-53824.herokuapp.com/set-category', {
					category: value,
				});
			},

		};
	},

};