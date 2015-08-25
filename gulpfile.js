var gulp = require('gulp');
var mocha = require('gulp-mocha');
var babelCompiler = require('babel/register');
var babel = require('gulp-babel');

gulp.task('test', function () {
  return gulp.src('./tests/**/*.{js,jsx}')
    .pipe(mocha({
      compilers: {
        js: babelCompiler
      },
      timeout: 5000
    }));
});

gulp.task('build', function (callback) {
  return gulp.src('./src/**/*.{js,jsx}')
    .pipe(babel({
      stage: 0
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.doneCallback = function (err) {
  process.exit(err ? 1 : 0);
};
