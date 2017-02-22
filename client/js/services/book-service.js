module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'Biography', 'Comedy', 'History', 'Poetry', 'Romance', 'Science Fiction', 'Fantasy', 'Thrillers', 'Suspense', 'Young Adult'
		];
		
		let bookList = [
			{
				title: 'title 1',
				author: 'author 1',
				link: 'link1',
			},
			{
				title: 'title 2',
				author: 'author 2',
				link: 'link2',
			},
			{
				title: 'title 3',
				author: 'author 3',
				link: 'link3',
			},
			{
				title: 'title 4',
				author: 'author 4',
				link: 'link4',
			}
		];

		let codes = ['url1', 'url2', 'url3', 'url4', 'url5'];

		return {
			getAllGenres() {
				return genres;
			},

			requestBooks() {
				return $http.post('/end-round', {}).then((response) => {
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