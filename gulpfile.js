var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var browserSync = require('browser-sync').create();

gulp.task("sass", function () {
	return gulp.src("./public/styles.scss")
	.pipe(plumber())
	.pipe(sass())
	.pipe(gulp.dest("./public/build"))
	.pipe(browserSync.stream());
});

gulp.task("scripts", function(){
	return gulp.src("./public/scripts.js")
	.pipe(plumber())
	.pipe(gulp.dest("./public/build"))
	.pipe(browserSync.stream());
});

gulp.task("watch", function() {
	gulp.watch("./public/styles.scss", ["sass"]);
	gulp.watch("./public/scripts.js", ["scripts"]);
	gulp.watch("./index.js").on("change", browserSync.reload);
});

gulp.task("browser-sync", ["nodemon"], function() {
    browserSync.init({
        proxy: {
			target: "http://localhost:3001",
			ws: true
		},
        port: 7001
    });
});

gulp.task("nodemon", function (cb) {
	var started = false;
	return nodemon({
		script: "index.js"
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task("default", [
	"sass",
	"scripts",
	"browser-sync",
	"watch"
]);