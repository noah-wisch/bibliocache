module.exports = {
	name: 'UserService',

	func($http) {
		/* Store user session info needed for game */
		function User(age, genre, readingLevel) {
			this.age = age;
			this.genre = genre;
			this.readingLevel = readingLevel;

			return this;
		}
		let user = new User(null, null, null);

		return {
			getUserInfo() {
				return user;
			},

			setGenre(value) {
				user.genre = value;
				$http.post('/set-category', {
					category: value,
				});
			},
		};
	},
};