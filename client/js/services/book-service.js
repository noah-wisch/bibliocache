module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'Fiction', 'Romance', 'Children\'s', 'Non-Fiction', 'Young Adult', 'Thrillers/Suspense', 'Science Fiction & Fantasy'
		];
		let sessionGenre = '';

		let codes = ['url1', 'url2', 'url3', 'url4', 'url5'];
		let sessionCode = '';

		return {
			submitGenre(value) {
				$http.post('https://enigmatic-woodland-53824.herokuapp.com/registration')
			},

			/**
			 * Mock setup for setting the category. 
			 * I think we need to set a new value for submitGenre() above now...
			 * NOAH LOOK HERE ON MONDAY
			 */

			// submitGenre(value) {
			// 	$http.post('https://enigmatic-woodland-53824.herokuapp.com/set-category')
			// },

			getAllGenres() {
				return genres;
			},

			getBooks() { // this method is for testing purposes
				return $http.get('https://enigmatic-woodland-53824.herokuapp.com/').then((response) => {
					let bookList = response.data;;
					console.log(bookList);

					for (let i = 0; i < bookList.length; i++) {
						console.log(bookList[i].title);
					}
				});
			},

			// setCode(code) {
			// 	user.code = code;
			// },

			testGetBooks() {
				return codes;
			}

		};
	},
}