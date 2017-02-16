module.exports = {
	name: 'RegistrationController',

	func($scope, $state, UserService) {
		$scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		$scope.password = '';
		$scope.passwordValidation = /^[a-zA-Z]\w{3,14}$/;
		// $scope.compare = (repass) => {
		// 	$scope.isconfirm = $scope.password === repass ? true : false;
		// }
		$scope.readingLevelValidation = /^[0-0]+$/;
		$scope.ageValidation = /^[0-9]+$/;

		$scope.createAccount = (email, password, readingLevel, age) => {
			let user = {
				age: age,
				category: 'Horror', // hardcoded for now
				email: email,
				location: [0, 0], // hardcoded for now
				password: password,
				readingLevel: readingLevel,
			};
			
			UserService.registerUser(user);
		};
	},
};