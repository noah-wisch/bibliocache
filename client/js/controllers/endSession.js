module.exports = {
	name: 'EndSessionController',
	func($scope, BookService, UserService) {

		let haveCode = false;
		$scope.codes = BookService.testGetBooks();

		$scope.submitCodeChoice = () => {
			// BookService.setCode($scope.selectedURL);
			haveCode = true;
			console.log('I choose you, Pikachu!');
		}

		$scope.playAgain = () => {
			console.log('They\'re playing again!');
		}
	},
};