module.exports = {
	name: 'BookService',

	func($http) {
		let genres = [
			'Biography', 'Comedy', 'History', 'Poetry', 'Romance', 'Science Fiction', 'Fantasy', 'Thrillers', 'Suspense', 'Young Adult'
		];
		
		const Book = function(title, author, link) {
			this.title = title;
			this.author = author;
			this.link = link;
			
			return this;
		};
		
		let bookList = [];

		return {
			getAllGenres() {
				return genres;
			},

			setGenre(value) {
				$http.post('/set-category', {
					category: value,
				}).then(function(response) {
					let books = response.data;
					for (let i=0; i<books.length; i++) {
						let book = new Book(books[i].title, books[i].author, books[i].infoLink);
						bookList.push(book);
					}
				});
			},

			getBooks() {
				return bookList;
			},
		};
	},
}