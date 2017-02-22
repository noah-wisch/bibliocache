module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'Biography', 'Comedy', 'History', 'Poetry', 'Romance', 'Science Fiction', 'Fantasy', 'Thrillers', 'Suspense', 'Young Adult'
		];
		
		let bookList = [];

		let codes = ['url1', 'url2', 'url3', 'url4', 'url5'];
		let sessionCode = '';

		return {

			getAllGenres() {
				return genres;
			},
			
			requestBooks() {
				return $http.post('/end-round', {}).then(function(response) {
					console.log('the book list is:');
					console.log(response);
				});
			},

			getBooks() {
				return bookList;
			},
		};
	},
}