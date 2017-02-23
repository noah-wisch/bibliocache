module.exports = {
	name: 'EndSessionController',
	func($scope, $state, BookService, UserService) {

		$scope.books = BookService.getBooks();

		// $scope.downloadLink = '#';
		$scope.submitBookChoice = (book) => {
			console.log(book);
			// $scope.downloadLink = book.link;
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