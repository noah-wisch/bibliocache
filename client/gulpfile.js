
const gulp = require('gulp');
const sass = require('gulp-sass');
const browser = require('gulp-browser');
const strip = require('gulp-strip-comments');

gulp.task('default', ['html', 'css', 'js']);

gulp.task('html', function () {
    gulp.src('templates/*.html')
        .pipe(gulp.dest('public/templates'));
	
	gulp.src('assets/*')
        .pipe(gulp.dest('public/assets'));

    return gulp.src('index.html')
        .pipe(gulp.dest('public/'))
        .pipe(strip.text());
});

gulp.task('css', function () {
    return gulp.src('scss/style.scss')
        .pipe(sass())
        .pipe(strip.text())
        .pipe(gulp.dest('public/'));
});

gulp.task('js', function () {
    return gulp.src('js/app.js')
        .pipe(browser.browserify())
        .pipe(strip.text())
        .pipe(gulp.dest('public/'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('js/*.js', ['js']);
    gulp.watch('js/*/*.js', ['js']);
    gulp.watch('scss/*.scss', ['css']);
    gulp.watch('*.html', ['html']);
    gulp.watch('templates/*.html', ['html']);
	gulp.watch('assets/*', ['html']);
});