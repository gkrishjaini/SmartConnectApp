var gulp = require('gulp');
var sh = require('shelljs');
var sass = require('gulp-sass');

gulp.task('default', ['ripple-emulate']);

gulp.task('ripple-emulate', function(){
	sh.exec('ripple emulate');
	//done();
});

gulp.task('android-release', function(){
	sh.exec('cordova build android --release');
	//done();
});

gulp.task('android-run', function(){
	sh.exec('cordova run android');
	//done();
});

gulp.task('ios-build', function(){
	sh.exec('cordova build ios --release');
});

gulp.task('sass', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});

gulp.task('sass-always', ['sass'], function() {
    gulp.watch('*.scss', ['sass']);
})