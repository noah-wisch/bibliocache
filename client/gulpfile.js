// Import Gulp
let gulp = require('gulp');

// Import Gulp Plugins
let sass = require('gulp-sass'); // download this npm plugin
let browser = require('gulp-browser');

// Default Task
gulp.task('default', ['html', 'css', 'js']);

// Subtasks
gulp.task('html', function() {
	gulp.src('templates/*.html')
		.pipe(gulp.dest('public/templates'));
	
	// copy index.html into the public/ directory
	return gulp.src('index.html')
		.pipe(gulp.dest('public/'));
})

gulp.task('css', function() {
	// convert style.scss into style.css
	// copy to public/
	return gulp.src('scss/style.scss')
		.pipe(sass()) // requires gulp-sass
		.pipe(gulp.dest('public/'));
})

gulp.task('js', function() {
	// copy js file into public/
	return gulp.src('js/app.js')
		.pipe(browser.browserify()) // require() local files
		.pipe(gulp.dest('public/'));
})

// Watch files for changes
gulp.task('watch', ['default'], function() {
	// gulp.watch('files-to-watch', 'tasks to run')
	gulp.watch('*.html', ['html']);
	gulp.watch('templates/*.html', ['html']);
	gulp.watch('scss/*.scss', ['css']);
    gulp.watch('js/*.js', ['js']);
	gulp.watch('js/*/*.js', ['js']);
});