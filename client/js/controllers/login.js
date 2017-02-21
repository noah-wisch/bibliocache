module.exports = {
	name: 'LoginController',

	func($scope, $state, UserService) {
		$scope.email = '';
		$scope.password = '';

		$scope.loginToAccount = (email, password) => {
			let user = {
				email: email,
				password: password,
			};

			UserService.logInUser(user);
		};
	},
};