module.exports = {
	name: 'UserService',
	
	func($http) {
		return {
			newSession() {
				console.log('new session');
			},
		};
	},
	
};