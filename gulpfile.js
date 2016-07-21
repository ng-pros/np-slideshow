// jshint node:true

var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var stylish = require('gulp-jscs-stylish');
var livereload = require('gulp-livereload');

gulp.task('lint', function() {
  'use strict';

  return gulp.src('src/**/*.js')
    .pipe(jscs())
    .pipe(jshint())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish', {
      beep: true,
    }));
});

gulp.task('watch', function() {
  'use strict';

  livereload.listen();

  gulp.watch(['src/**', 'examples/**'], ['lint'])
    .on('change', livereload.changed);
});

gulp.task('connect', function() {
  'use strict';

  connect.server({
    root: ['examples', 'src', 'bower_components']
  });
});

gulp.task('default', ['lint', 'watch', 'connect']);
