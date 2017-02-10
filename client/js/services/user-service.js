module.exports = {
	name: 'UserService',
	
	func($http) {
		return {
			registerUser(user) {
				// http post with new user object
				console.log('new user');
			},
			
			logInUser(user) {
				// http post with user object
				console.log('log in user');
			},
			
			newSession() {
				console.log('new session');
			},
			
		};
	},
	
};