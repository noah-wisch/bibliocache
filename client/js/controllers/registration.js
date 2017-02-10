module.exports = {
    name: 'RegistrationController',
	
    func($scope, $state, UserService) {
        $scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		$scope.passwordValidation = /^[*]+$/;
		//  below is untested
		//	/^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;
		
		$scope.readingLevelValidation = /^[0-0]+$/;
		$scope.ageValidation = /^[0-9]+$/;
		
		$scope.createAccount = (email, password, readingLevel, age) => {
            let user = {
				email: email,
				password: password,
				readingLevel: readingLevel,
				category: 'Horror', // hardcoded for now
				location: [0,0], // hardcoded for now
				age: age,
			};
			
			UserService.registerUser(user).then(function() {
				$state.go('new-session');
			});
        };
    },
};