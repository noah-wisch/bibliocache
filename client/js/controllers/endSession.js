module.exports = {
	name: 'EndSessionController',
	func($scope, $state, BookService, UserService) {

		let haveCode = false;
		$scope.codes = BookService.getBooks();

		$scope.submitCodeChoice = () => {
			// BookService.setCode($scope.selectedURL);
			haveCode = true;
			console.log('I choose you, Pikachu!');
		}

		$scope.playAgain = () => {
			$state.go('new-session');
		}

		$scope.logOut = () => {
			console.log('logging out');
			$http.post('/logout', {});
		}
	},
};