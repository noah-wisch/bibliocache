module.exports = {
	name: 'BookService',
	
	func($http) {
		return {
			updateBooks() {
				console.log('I got the book!');
			},
		};
	},
	
};