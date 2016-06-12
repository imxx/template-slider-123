'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var $ = require("gulp-load-plugins")({ lazy: true });


gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000",
        files: ["src/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});
gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'app.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

gulp.task("styles", function(){
    return gulp
        .src("./src/less/*.less")
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ["Firefox > 4", "last 2 versions", "> 1%"]}))
        .pipe($.concat("main.css"))
        .pipe(gulp.dest("./src/styles/"));
});

gulp.task("optimize-css", ["styles"], function(){
    return gulp.src("./public/styles/main.css")
                .pipe($.csso())
                .pipe(gulp.dest("./public/min/"));
});

gulp.task("optimize-js", function(){
    return gulp.src("./public/scripts/MainCtrl.js")
                .pipe($.uglify())
                .pipe()
                .pipe(gulp.dest("./public/scripts/min/"));
});

gulp.task("watch-styles", function(){
    gulp.watch("./src/less/**.less", ["styles"]);
});

gulp.task("prepare-for-build", ["copy-fonts"], function(){
    return gulp.src("./src/index.html")
                .pipe($.useref({ searchPath: "./src/" }))
                .pipe($.if("*.css", $.csso()))
                .pipe($.if("*.js", $.uglify()))
                .pipe($.rev())
                .pipe($.revReplace())
                .pipe(gulp.dest("./build/"))
                .pipe($.rev.manifest())
                .pipe(gulp.dest("./build/"));
});

gulp.task("copy-fonts", function(){
    return gulp.src("./src/fonts/**/*")
                .pipe(gulp.dest("./build/fonts/"));
});