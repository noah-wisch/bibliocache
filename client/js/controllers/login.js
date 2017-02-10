module.exports = {
    name: 'LoginController',
	
    func($scope, $state, UserService) {
        $scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		$scope.passwordValidation = /^[*]+$/;
		//  below is untested
		//	/^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;
        
		$scope.loginToAccount = (email, password) => {
			let user = {
				email: email,
				password: password,
			};
			
			UserService.logInUser(user).then(function() {
				$state.go('new-session');
			});
        };
    },
};