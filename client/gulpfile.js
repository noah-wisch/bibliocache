
const gulp = require('gulp');
const sass = require('gulp-sass');
const browser = require('gulp-browser');
const strip = require('gulp-strip-comments');

const build_path = '../build/resources/main/static';
const src_path = '../src/main/resources/static';

gulp.task('default', ['html', 'css', 'js']);

gulp.task('html', function () {
    gulp.src('templates/*.html')
        .pipe(gulp.dest(`${build_path}/templates`))
		.pipe(gulp.dest(`${src_path}/templates`));
	
	gulp.src('assets/*')
        .pipe(gulp.dest(`${build_path}/assets`))
		.pipe(gulp.dest(`${src_path}/assets`));
	
    return gulp.src('*.html')
		.pipe(strip.text())
        .pipe(gulp.dest(build_path))
		.pipe(gulp.dest(src_path));
});

gulp.task('css', function () {
    return gulp.src('scss/style.scss')
        .pipe(sass())
        .pipe(strip.text())
        .pipe(gulp.dest(build_path))
		.pipe(gulp.dest(src_path));
});

gulp.task('js', function () {
    return gulp.src('js/app.js')
        .pipe(browser.browserify())
        .pipe(strip.text())
        .pipe(gulp.dest(build_path))
		.pipe(gulp.dest(src_path));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('js/*.js', ['js']);
    gulp.watch('js/*/*.js', ['js']);
    gulp.watch('scss/*.scss', ['css']);
    gulp.watch('*.html', ['html']);
    gulp.watch('templates/*.html', ['html']);
	gulp.watch('assets/*', ['html']);
});