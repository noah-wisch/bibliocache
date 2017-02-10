module.exports = {
	name: 'UserService',
	
	func($http) {
		return {
			registerUser(user) {
				//return $http.post('https://enigmatic-woodland-53824.herokuapp.com/registration', user);
				console.log('posting new user');
				return {};
			},
			
			logInUser(user) {
				//return $http.post('https://enigmatic-woodland-53824.herokuapp.com/login', user);
				console.log('posting existing user');
				return {};
			},
			
			newSession() {
				console.log('new session');
			},
			
		};
	},
	
};