module.exports = {
	name: 'EndSessionController',
	func($scope, $state, BookService, UserService) {

		$scope.books = BookService.getBooks();

		$scope.submitBookChoice = () => {
			console.log($scope.selectedBookURL);
			BookService.setBook($scope.selectedBookURL);
		}

		$scope.playAgain = () => {
			$state.go('new-session');
		}
	},
};