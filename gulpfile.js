var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var $ = require('gulp-load-plugins')();
var del = require('del');
var sass = require('gulp-ruby-sass');
var stylish = require('jshint-stylish');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
var rjs = require('requirejs');
var notify = require('gulp-notify');
var fse = require('fs-extra');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');

var watchDir = 'watch/';
var deployDir = 'build/';

gulp.task('cleanWatch', function (cb) {
    del(['watch'], cb);
});
gulp.task('cleanBuild', function (cb) {
    del(['build'], cb)
});

gulp.task('setWatch', function () {
    global.isWatch = true;
});

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js', '!src/**/*_test.js', '!src/vendors/**'])
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('csslint', ['cleanWatch', 'setWatch', 'compileSass'], function () {
    return gulp.src([watchDir + '**/*.css'])
        .pipe($.csslint('.csslintrc'))
        .pipe($.csslint.reporter(stylish));
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        startPath: '/watch/app/family/homepage/index.html'
    })
});

gulp.task('compileScript', function (cb) {
    var startTime = new Date().getTime();
    var configBuild = require('./build.js').getConf();
    if (global.isWatch) {
        configBuild.dir = watchDir;
        configBuild.optimize = 'none';
        configBuild.useSourceUrl = true;
        configBuild.path['requirejs'] = configBuild.path['requirejs'].replace(/.min$/, '');
    } else {
        configBuild.dir = deployDir;
    }
    rjs.optimize(configBuild, function (buildResponse) {
        console.log('build response', buildResponse);
        // delete app-build.config.js
        del.sync(configBuild.dir + 'app-build.config.js');
        // delete unused requirejs
        var requirePath = configBuild.path['requirejs'];
        if (/.min$/.test(requirePath)) {
            var unMinifiedPath = configBuild.dir + requirePath.replace(/.min$/, '') + '.js';
            del.sync([unMinifiedPath]);
            // move require.min.js to require.js
            fse.renameSync(configBuild.dir + requirePath + '.js', unMinifiedPath);
            console.log('move require.min.js to requre.js success');
        } else {
            del.sync([configBuild.dir + requirePath + '.min.js']);
            console.log('delete require.min.js success');
        }
        // delete unused goldlog
        var goldlogPath = configBuild.path['goldlog'];
        if (/.min$/.test(goldlogPath)) {
            var unMinifiedPath = configBuild.dir + goldlogPath.replace(/.min$/, '') + '.js';
            del.sync([unMinifiedPath]);
            // move goldlog.min.js to goldlog.js
            fse.renameSync(configBuild.dir + goldlogPath + '.js', unMinifiedPath);
            console.log('move goldlog.min.js to goldlog.js success');
        } else {
            del.sync([configBuild.dir + goldlogPath + '.min.js']);
            console.log('delete goldlog.min.js success');
        }
        // delete *-test.js
        del.sync([configBuild.dir + '**/*-test.js']);
        // delete *-tpl.html
        del.sync([configBuild.dir + '**/*-tpl.html']);
        if (global.isWatch) {
            reload({stream: true});
        }
        var time = (new Date().getTime() - startTime) / 1000;
        console.log('compileScript was finished: ' + time + 's');
        cb();
    }, function (err) {
        console.log('compileScript error!', err);
        gulp.src("*").pipe(notify({
            message: err,
            title: 'compileScript error!',
            onLast: true,
            sound: true
        }));
        if (global.isWatch) {
            cb();
        } else {
            process.kill(process.pid);
        }
    });
});

gulp.task('zipBuildResource', ['compileScript', 'deployStyles'], function () {
    var startTime = new Date().getTime();
    return gulp.src([deployDir + '**/*.js', deployDir + '**/*.css'])
        .pipe(gzip())
        .pipe(gulp.dest(deployDir))
        .pipe(reload({stream: true}))
        .on('end', function () {
            time = (new Date().getTime() - startTime) / 1000;
            console.log('resource was gzipped: ' + time + 's');
        });
});

// lazy compile
gulp.task('onWatchScripts', function () {
    if (global.watchTimeout) {
        clearTimeout(global.watchTimeout);
    }
    global.watchTimeout = setTimeout(function () {
        global.watchTimeout = undefined;
        gulp.start(['compileScript']);
    }, 200);
});

gulp.task('watchScripts', function () {
    gulp.watch(['src/**/*.js', 'src/**/*-tpl.html', '!src/**/*_test.js'], ['onWatchScripts']);
});

gulp.task('compileSass', function () {
    var destDir = global.isWatch ? watchDir : deployDir;

    return gulp.src(['src/**/module.scss', 'src/**/screen-*.scss', 'src/**/app.scss', 'src/**/demo.scss'])
        .pipe($.changed(destDir))
        .pipe(sass({
            sourcemap: global.isWatch ? 'auto' : 'none',
            sourcemapBase: '..',
            sourcemapPath: '..',
            loadPath: ['src/app/styles', 'src/libs', 'src/components']
        }))
        .on('error', $.notify.onError())
        .pipe(gulpif(global.isWatch, sourcemaps.init({loadMaps: true})))
        .pipe(autoprefixer({
            browsers: ['last 10 versions']
        }))
        .pipe(gulpif(global.isWatch, sourcemaps.write('./')))
        .pipe(gulp.dest(destDir))
        .pipe(reload({stream: true}));
});

gulp.task('deployStyles', ['compileSass'], function () {
    return gulp.src([deployDir + '**/*.css'])
        .pipe($.cssmin())
        .pipe(gulp.dest(deployDir));
});

gulp.task('delStyleMaps', function (cb) {
    del([deployDir + '**/*.css.map', deployDir + '**/*.css.map.map'], cb);
});

gulp.task('watchStyles', function () {
    gulp.watch('src/**/*.scss', ['compileSass']);
});

gulp.task('copyHtmls', function () {
    var destDir = global.isWatch ? watchDir : deployDir;
    return gulp.src(['src/**/*.html', 'src/**/assets/**', '!src/**/*-tpl.html', '!src/**/*.psd'])
        .pipe($.changed(destDir))
        .pipe(gulp.dest(destDir))
        .pipe(reload({stream: true}));
});

gulp.task('watchHtmls', function () {
    gulp.watch(['src/**/*.html', '!src/**/*-tpl.html', 'demo/**/*.json'], ['copyHtmls']);
});

gulp.task('watch', ['cleanWatch', 'setWatch'], function () {
    gulp.start(['browserSync', 'compileScript', 'compileSass', 'watchStyles', 'watchScripts', 'copyHtmls', 'watchHtmls']);
});

// gulp.task('build', ['lint', 'cleanBuild'], function() {
gulp.task('build', ['cleanBuild'], function () {
    process.env.NODE_ENV = 'production';
    gulp.start(['compileScript', 'deployStyles']);
});

gulp.task('default', function () {
    console.log('Run "gulp watch or gulp build"');
});
