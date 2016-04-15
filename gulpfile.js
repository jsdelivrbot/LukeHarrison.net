/*
|--------------------------------------------------------------------
| SET DEPENDENCIES
|--------------------------------------------------------------------
*/

// Required for all tasks
var gulp = require('gulp');
// Required for SASS tags
var sass = require('gulp-sass');
// Minifies images
var imagemin = require('gulp-imagemin');
// Used to prevent minifying of unchanged images
var cache = require('gulp-cache');
// Used to concat core js file
var concat = require('gulp-concat');
// Used to minify JS
var uglify = require('gulp-uglify');
// Used to rename CSS and JS depending if minified
var rename = require("gulp-rename");
// Used to add conditional functionality
var gulpif = require('gulp-if');
// Used to allow SASS to require JSON data
var sassport = require('gulp-sassport');
// Used to create synchronous build tasks
var runSequence = require('run-sequence');
// Used to convert ES2015 to accepted JS
var babel = require("gulp-babel");
// Used to convert Jade to HTML
var jade = require('gulp-jade');
// Used to pipe JSON data into Jade
var data = require('gulp-data');
// Used to delete folders during build process
var del = require('del');
// Used to inject breakpoints json data as object into breakpoints.js
var inject = require('gulp-inject');
// Used to add autoprefixer to SASS task
var autoprefixer = require('gulp-autoprefixer');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var glob = require('glob');

/*
|--------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------
*/

// If minify is true then css & js will be minified
// This is in case the code needs to be maintained by a less-technical developer
var minify = true;

/*
|--------------------------------------------------------------------
|  DELETE DIST FOLDER
|--------------------------------------------------------------------
*/

gulp.task('deleteDist', function(){
	return del('dist/');
});

/*
|--------------------------------------------------------------------
|  JADE
|--------------------------------------------------------------------
*/

// Filter in JSON data
gulp.task('html', function() {
  return gulp.src('./dev/jade/*.jade')
    // .pipe(data(function(file){
    //  		return require('./dev/data/info.json');
    //  }))
    .pipe(jade())
    .pipe(gulp.dest('dist/'));
});

/*
|--------------------------------------------------------------------
|  SASS
|--------------------------------------------------------------------
*/

gulp.task('sass-style', function () {
	return gulp.src('dev/sass/*.scss')
	.pipe(gulpif(minify, sassport([],{outputStyle: 'compressed'}), sassport([], {outputStyle: 'expanded'})))
    	.pipe(gulpif(minify, rename({ suffix: '.min' })))
	.on('error', sass.logError)
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
		cascade: false
	}))
	.pipe(gulp.dest('./dist/css/'))
});

gulp.task('sass-ie8', function(){
	return gulp.src('dev/sass/ie8.scss')
	.pipe(gulpif(minify, sass({outputStyle: 'compressed'}), sass({outputStyle: 'expanded'})))
    	.pipe(gulpif(minify, rename("ie8.min.css")))
	.on('error', sass.logError)
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
	}))
	.pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass', function(){
	runSequence(
		"sass-style",
		"sass-ie8"
	);
});

/*
|--------------------------------------------------------------------
|  IMAGES
|--------------------------------------------------------------------
*/

// Image MIN & with CACHE to stop repeat compressed images
gulp.task('images', function(){
	return gulp.src('dev/img/*.+(png|jpg|gif|svg)')
	//.pipe(imagemin())
	.pipe(gulp.dest('dist/img/'))
});

/*
|--------------------------------------------------------------------
|  JS
|--------------------------------------------------------------------
*/

// Combine JS and minify
// gulp.task('js-process', function() {
// 	return gulp.src([
// 		'./dev/js/partials/vendor/*.js',
// 		'./dev/js/partials/polyfills/*.js',
// 		'./dev/js/partials/modules/breakpoints.js',
// 		'./dev/js/global.js'
// 	])
// 	.pipe(concat('core.js'))
	// .pipe(inject(gulp.src('./dev/data/config.json'), {
	// 	starttag: '/* inject: Breakpoints JSON */',
	// 	endtag: '/* endinject */',
	// 	transform: function (filePath, file) {
	// 		// return file contents as string
	// 		return "var bpData = " + file.contents.toString('utf8')
	// 	},
	// 	removeTags: true
	// }))
// 	.pipe(babel())
//     	.pipe(gulpif(minify, rename("core.min.js"), gulp.dest('./dist/js')))
//     	.pipe(gulpif(minify, uglify()))
//     	.pipe(gulpif(minify, gulp.dest('./dist/js/')));
// });

gulp.task('jsbuild', function() {
	var files = glob.sync('./dev/js/*.js');
	files.map(function(file) {
		var name = file.replace("./dev/js/", "");
		name = name.replace(".js", "");
		return browserify({entries: file})
		.bundle()
		.pipe(source(file))
		.pipe(rename({ 
			dirname: "",
			basename: name,
			suffix: ".min",
			extname: ".js"
		}))
		.pipe(babel())
		.pipe(gulp.dest('./dist/js/'));
	});
});

// Copy Across specific JS files
gulp.task('js-copy', function() {
	// Copy all non-directory files
	gulp.src('dev/js/seperate/*.js')
    	.pipe(gulpif(minify, rename({ suffix: '.min' }), gulp.dest('./dist/js/')))
    	.pipe(gulpif(minify, uglify()))
    	.pipe(gulpif(minify, gulp.dest('./dist/js/')));
});

gulp.task('js', function(){
	runSequence(
		"js-process",
		"js-copy"
	);
});

/*
|--------------------------------------------------------------------
|  MISC
|--------------------------------------------------------------------
*/

// Copy Misc Files Task
gulp.task('copy', function() {

	// Copy all non-directory files
	gulp.src('dev/*.+(xml|txt|json|php)')
	.pipe(gulp.dest('dist/'));

	// Copy specified folders and contents
    	gulp.src('*/+(fonts)/**', {base:"./dev/"})
      .pipe(gulp.dest('dist/'));

	// Copy HTACCESS file seperately as it wouldn't play nice
	gulp.src('dev/.htaccess')
	.pipe(gulp.dest('dist/'));
});

/*
|--------------------------------------------------------------------
|  PRODUCTION FUNCTIONS
|--------------------------------------------------------------------
*/

// Here we pull everything together into generic watch and build functions

// WATCH FUNCTION
gulp.task("watch", function() {
	// HTML
	gulp.watch('dev/jade/**/*.jade',['html']);
	// Images
	gulp.watch('dev/img/*.+(png|jpg|gif|svg)',['images']);
	// Watch for Breakpoint JS changes and compile SASS
	gulp.watch('dev/data/breakpoints.json',['sass']);
	// SASS
	gulp.watch('dev/sass/**/*.scss',['sass']);
	// JS
	gulp.watch('dev/js/**/*.js',['js']);
});

// BUILD FUNCTION
gulp.task('build',function() {
	runSequence(
		// Delete Dist Folder
		"deleteDist",	
		// Run other tasks asynchronously 
		["html", "images", "sass", "js", "copy"]
	);
});