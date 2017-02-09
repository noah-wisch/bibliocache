module.exports = {
    name: 'LoginController',
    func($scope) {
        $scope.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        $scope.createAccount = () => {
            console.log('test account')
            // UserService.send($scope.username)
            // UserService.send($scope.password)
        }
    },
};