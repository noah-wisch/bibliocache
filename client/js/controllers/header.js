module.exports = {
	name: 'HeaderController',
	func($scope, BookService, UserService) {

		$scope.logOut = () => {
			UserService.logOutUser();
			console.log('user logged out');
		}
	},
};