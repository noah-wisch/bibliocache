module.exports = {
	name: 'RegistrationController',

	func($scope, $state, UserService) {
		$scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		$scope.password = '';
		$scope.passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/;

		$scope.readingLevelValidation = /^[0-9]+$/;
		$scope.ageValidation = /^[0-9]+$/;

		$scope.form = {
			readingLevel: null,
			age: null,
		};

		$scope.createAccount = (email, password, readingLevel, age) => {

			let user = {
				age: age,
				category: null,
				email: email,
				location: [0, 0], // hardcoded
				password: password,
				readingLevel: readingLevel,
			};

			UserService.registerUser(user);
		};
	},
};