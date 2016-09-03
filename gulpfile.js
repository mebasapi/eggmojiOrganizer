'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    es = require('event-stream');

// Modules for webserver and livereload
var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    livereloadport = 35730,
    serverport = 5000;

// Set up an express server (not starting it yet)
var server = express();
// Add live reload
server.use(livereload({
    port: livereloadport
}));
// Use our 'app' folder as rootfolder
server.use(express.static('./app'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendFile('index.html', {
        root: 'dist'
    });
});

gulp.task('dev', ['clean', 'content', 'lint'], function() {});
gulp.task('build', ['clean', 'content'], function() {});
gulp.task('content', ['views', 'js', 'styles'], function() {});

// Clean task
gulp.task('clean', function(cb) {
    var stream = rimraf('./dist/**/*', cb);
    return stream;
});

// JSHint task
gulp.task('lint', function() {
    gulp.src(['!./app/bower_components{,/**}', 'app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Updating references in index.html
gulp.task('index', function() {
    var bowerInjectSrc = gulp.src(bowerFiles(), {
        read: false
    });
    var bowerInjectOptions = {
        name: 'bower',
        relative: true
    };

    return gulp.src('./app/index.html')
        .pipe(inject(gulp.src([
            '!./app/bower_components{,/**}',
            './app/**/*.js',
            './app/css/**/*.css'
        ]), {
            relative: true
        }))
        .pipe(inject(bowerInjectSrc, bowerInjectOptions))
        .pipe(gulp.dest('./app'));
});

// Styles task
gulp.task('styles', ['clean'], function() {
    gulp.src('app/**/*.scss')
        // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
        .pipe(sass({
            onError: function(e) {
                console.log(e);
            }
        }))
        .pipe(gulp.dest('app/css/')).pipe(gulp.dest('dist/css/'));

    // Get our index.html
    gulp.src(['app/bower_components/**/*.css', 'app/bower_components/**/*.woff*'])
        // And put it in the dist folder
        .pipe(gulp.dest('dist/bower_components'));

});

// Views task
gulp.task('views', ['clean'], function() {
    // Get our index.html
    gulp.src('app/index.html')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/'));

    // Any other view files from app/views
    gulp.src('app/**/*.html')
        // Will be put in the dist/views folder
        .pipe(gulp.dest('dist/'));
});

// Views task
gulp.task('js', ['clean'], function() {
    // Get our index.html
    gulp.src('app/app.js')
        // And put it in the dist folder
        .pipe(gulp.dest('dist/'));

    gulp.src('app/common/**/*.js').pipe(gulp.dest('dist/common'));
    gulp.src('app/components/**/*.js').pipe(gulp.dest('dist/components'));
    gulp.src('app/bower_components/**/*.min.js').pipe(gulp.dest('dist/bower_components'));
});

gulp.task('watch', ['lint'], function() {
    // Start webserver
    server.listen(serverport);
    // Start live reload
    refresh.listen(livereloadport);

    // Watch our scripts, and when they change run lint and browserify
    gulp.watch(['app/**/*.js', 'app/**/*.js'], [
        'lint',
        'views'
        // 'browserify'
    ]);

    // Watch our sass files
    gulp.watch(['app/**/*.scss'], [
        'styles',
        'views'
    ]);

    gulp.watch(['app/**/*.html'], [
        'views'
    ]);

    gulp.watch('./dist/**').on('change', refresh.changed);

});

gulp.task('default', ['dev', 'watch']);
