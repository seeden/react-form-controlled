var gulp = require('gulp');
var mocha = require('gulp-mocha');
var babelCompiler = require('babel/register');
var babel = require('gulp-babel');

gulp.task('test', function () {
  return gulp.src('./tests/**/*.js')
    .pipe(mocha({
      compilers: {
        js: babelCompiler
      },
      timeout: 5000
    }));
});

gulp.task('build', function (callback) {
  return gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.doneCallback = function (err) {
  process.exit(err ? 1 : 0);
};
