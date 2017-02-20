module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'Biography', 'Folklore', 'History', 'Poetry', 'Romance', 'Science Fiction & Fantasy', 'Thrillers & Suspense', 'Young Adult'
		];

		let codes = ['url1', 'url2', 'url3', 'url4', 'url5'];
		let sessionCode = '';

		return {

			getAllGenres() {
				return genres;
			},

			getBooks() {
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