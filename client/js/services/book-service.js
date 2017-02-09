module.exports = {
	name: 'BookService',
	
	func($http) {
		let genres = [
			'Comedy', 'Horror', 'Fantasy', 'Childrens', 'Romance', 'Fiction', 'Non-Fiction'
		];

		let sessionGenre = '';

		return {
            submitGenre(value) {
                $http.post('https://enigmatic-woodland-53824.herokuapp.com/registration')
            },
			getAllGenres() {
				return genres;
			},
        };
	},
}