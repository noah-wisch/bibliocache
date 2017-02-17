module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'Fiction', 'Romance', 'Children\'s', 'Non-Fiction', 'Young Adult', 'Thrillers/Suspense', 'Science Fiction & Fantasy'
		];
		let sessionGenre = '';

		return {
			submitGenre(value) {
				$http.post('https://enigmatic-woodland-53824.herokuapp.com/registration')
			},

			getAllGenres() {
				return genres;
			},

			getBooks() { // this method is for testing purposes
				return $http.get('https://enigmatic-woodland-53824.herokuapp.com/').then(function (response) {
					let bookList = response.data;;
					console.log(bookList);

					for (let i = 0; i < bookList.length; i++) {
						console.log(bookList[i].title);
					}
				});
			},

		};
	},
}