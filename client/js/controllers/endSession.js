module.exports = {
	name: 'EndSessionController',
	func($scope, $state, BookService, UserService) {

		$scope.books = BookService.getBooks();
		$scope.selectedBook = document.querySelector('#selectedBook');

		// $scope.downloadLink = '#';
		$scope.submitBookChoice = (book) => {
			console.log(book);
			let value = $scope.selectedBook.options[$scope.selectedBook.selectedIndex].value;
			value = JSON.parse(value);
			window.location = value.link;
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