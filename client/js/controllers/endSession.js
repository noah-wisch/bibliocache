module.exports = {
  name: 'EndSessionController',
  func($scope, BookService, UserService) {

    console.log('Congrats! Ending your session.');

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