module.exports = {
	name: 'LoginController',

	func($scope, $state, UserService) {
		$scope.email = '';
		$scope.emailValidation = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		$scope.password = '';
		$scope.passwordValidation = /^[a-zA-Z]\w{3,14}$/;

		$scope.loginToAccount = (email, password) => {
			let user = {
				email: email,
				password: password,
			};

			UserService.logInUser(user);
		};
	},
};