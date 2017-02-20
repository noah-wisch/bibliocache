module.exports = {
	name: 'HeaderController',
	func($scope, BookService, UserService) {

		$scope.logOut = () => {
			console.log('user logged out');
			UserService.logOut();
		};
	},
};