module.exports = {
	name: 'HeaderController',
	func($scope, BookService, UserService) {

		console.log('asdf header controller');
		$scope.logOut = () => {
			console.log('user logged out');
			UserService.logOut();
		};
	},
};