module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'History', 'Romance', 'Folklore', 'Biography', 'Young Adult', 'Thrillers/Suspense', 'Science Fiction & Fantasy', 'Poetry'
		];
		let sessionGenre = '';

		let codes = ['url1', 'url2', 'url3', 'url4', 'url5'];
		let sessionCode = '';

		return {
			
			setGenre(value) {
				sessionGenre = value;
				console.log(sessionGenre);
				$http.post('https://enigmatic-woodland-53824.herokuapp.com/set-category', {
					category: value,
				});
			},

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