//--------------------------------------------------------------------------------------------------------------------------------------
// GULP OPTIONS
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Tweak various options to suit the needs of your project
*/

// MINIFY
//--------------------------------------------------------------------------------------------------------------------------------------

/*
If minify is true then CSS & JS will be minified once compiled and will have a .min suffix before the file
extension. For example 'style.min.css'.
*/

const minify = true;


// SASS LINTING
//--------------------------------------------------------------------------------------------------------------------------------------

/*
If lint is true then SASS will be linted by stylelint to enforce style guidelines. These rules can be tweaked 
in '.stylelintrc'.
*/

const lint = true;


// CONFIGURE PATHS
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Here you can configure the paths used by Gulp to align with your project's directory structure.
*/

// Development root
const dev = "dev";

// Distribution root
const dist = "dist";

// HTML directories
const htmlDev = "dev/html";
const htmlDist = dist;

// Image directories
const imgDev = "dev/img";
const imgDist = "dist/img";

// SASS directories
const sassDev = "dev/sass";
const sassDist = "dist/css";

// JS directories
const jsDev = "dev/js";
const jsDist = "dist/js";


//--------------------------------------------------------------------------------------------------------------------------------------
// SET DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------

// Required for all tasks
const gulp = require('gulp');
// Required for SASS tags
const sass = require('gulp-sass');
// Required for SASS sourcemaps
const sourcemaps = require('gulp-sourcemaps');
// Used to lint SASS
const gulpStylelint = require('gulp-stylelint');
// Adds support for SASS globbing
const sassGlob = require('gulp-sass-glob');
// Minifies images
const imagemin = require('gulp-imagemin');
// Used to minify JS
const uglify = require('gulp-uglify');
// Used to rename CSS and JS depending if minified
const rename = require("gulp-rename");
// Used to add conditional functionality
const gulpif = require('gulp-if');
// Used to remove unused CSS styles post compile
const uncss = require('gulp-uncss');
// Used to create synchronous build tasks
const runSequence = require('run-sequence');
// Used to delete folders during build process
const del = require('del');
// Used to add autoprefixer to SASS task
const autoprefixer = require('gulp-autoprefixer');
// Used to compile JS modules
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const glob = require('glob');
const streamify = require('gulp-streamify');
// Used to generate svg icon system and to minify
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const path = require('path');
const inject = require('gulp-inject');
// Used to compile nunjacks templates if present
const nunjucks = require('nunjucks');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const gulpNunjucks = require('gulp-nunjucks');
const merge = require('merge-stream');
// Used to make directories
const mkdirp = require('mkdirp');
// Required to generate sitemap
const sitemap = require('gulp-sitemap');
// Used to make local dev server
const webserver = require('gulp-webserver');


//--------------------------------------------------------------------------------------------------------------------------------------
// FUNCTIONS
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Create all the individual functions which will contribute towards our production functions
*/


// SERVER TASK
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Creates a server at localhost:8000
*/

gulp.task('serve', function() {
	gulp.src('./dist/')
	.pipe(webserver({
		open: true
	}));
});


// SETUP TASK
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Task which you run on project start to setup SASS directory and copy required files from OrionCSS dependancy

Creates SASS directory in dev directory and adds the following:-

- Creates ITCSS directory structure
- sample.main-orion-framework renamed to main and copied to SASS root
- sample.component.mycomponent added to "06 - components" directory
*/

const folders = [
	sassDev + "/01 - settings",
	sassDev + "/02 - tools",
	sassDev + "/03 - generic",
	sassDev + "/04 - elements",
	sassDev + "/05 - objects",
	sassDev + "/06 - components",
	sassDev + "/07 - utilities",
	jsDev
]

gulp.task('setup', function(){
	// Generate directories
	for(var i = 0; i < folders.length; i++) {
		mkdirp(folders[i], function (err) {
			if(err){
				console.error(err);
			}
		});
	}
	// Grab main sample and move to SASS root
	gulp.src('node_modules/orioncss/sample.main-orion-framework.scss')
	.pipe(rename('main.scss'))
	.pipe(gulp.dest(sassDev))
	// Grab sample component and move to new components dir
	gulp.src('node_modules/orioncss/06 - components/_sample.component.mycomponent.scss')
	.pipe(gulp.dest(sassDev + '/06 - components/'));
	// Gram sample JS main, rename and then 
	gulp.src('node_modules/orionjs/sample.main.js')
	.pipe(rename('main.js'))
	.pipe(gulp.dest(jsDev))
});

// Developer task to clear content added by setup task so we don't accidently commit it.
gulp.task('unsetup', function(){
	del(sassDev);
	del(jsDev);
});


// DELETE DIST DIRECTORY
//--------------------------------------------------------------------------------------------------------------------------------------

// Delete any existing Dist directory so old files don't contaminate our new build

gulp.task('deleteDist', function(){
	return del(dist);
});


// SASS
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Compile SASS, add autoprefixer and filter out unused CSS styles, that way we can have unlimited utility
classes and only have the ones we're actually using in our compiled CSS file.

We also tell uncss to ignore styles with stateful modifiers as these are typically added into the DOM
dynamically which UNCSS is unable to detect.
*/

gulp.task('sass', function () {
	return gulp.src(sassDev + '/*.scss')
	.pipe(sassGlob())
	.pipe(sourcemaps.init())
	.pipe(gulpif(minify, sass({outputStyle: 'compressed', precision: 8}), sass({outputStyle: 'expanded', precision: 8})))
	.pipe(gulpif(minify, rename({ suffix: '.min' })))
	.on('error', sass.logError)
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
		cascade: false
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./' + sassDist))
});

// A SASS task for debug use. Compiles an unminified stylesheet but uses canon naming structure as
// per minify variable so no links are broken on the page
gulp.task('sass-debug', function () {
	return gulp.src(sassDev + '/*.scss')
	.pipe(sassGlob())
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'expanded', precision: 8}))
	.pipe(gulpif(minify, rename({ suffix: '.min' })))
	.on('error', sass.logError)
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
		cascade: false
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./' + sassDist))
});


// Lint SASS Task
gulp.task('sass-lint', function lintCssTask() {
	return gulp.src(sassDev + '/**/*.scss')
	.pipe(gulpStylelint({
		reportOutputDir: 'reports/lint',
		reporters: [{
			formatter: 'verbose',
			console: true,
			save: 'report.txt'
		}]
	}));
});

// UNCSS Task
gulp.task('uncss', function () {
	return gulp.src(sassDist + '/*.css')
	.pipe(uncss({
		html: [htmlDist + '/**/*.html'],
		ignore: [
			/\.is-*/,
			/\.has-*/,
			/\.in-*/,
			/\#icon-*/,
			/\.js-*/,
			/\.ua-*/,
			/\.no-*/,
			/\.hljs*/
		]
	}))
	.pipe(gulp.dest('./' + sassDist))
});

// Watch task for SASS. Lints and then runs standard SASS functions. No UNCSS to speed things up..
gulp.task('sass-watch', function(){
	if(lint) {
		runSequence(
			"sass-lint",
			"sass"
		);
	}
	else {
		runSequence(
			"sass"
		);		
	}
});

// Create seperate sass build task which lints and then runs standard SASS functions followed by UNCSS
// This will be used on Build task. It won't be used on watch task to speed things up.
gulp.task('sass-build', function(){
	if(lint) {
		runSequence(
			"sass-lint",
			"sass"
		);
	}
	else {
		runSequence(
			"sass"
		);		
	}
});

gulp.task('sass-build-debug', function(){
	if(lint) {
		runSequence(
			"sass-lint",
			"sass-debug"
		);
	}
	else {
		runSequence(
			"sass"
		);		
	}
});


// IMAGES
//--------------------------------------------------------------------------------------------------------------------------------------

// Image MIN & with CACHE to stop repeat compressed images
gulp.task('bitmap', function(){
	gulp.src(imgDev + '/**/*.+(png|jpg|gif|ico)')
	.pipe(imagemin({optimizationLevel: 3, progressive: true}))
	.pipe(gulp.dest(imgDist));
});

// Compile all SVG icons into one large svg icon and inject as inline svg into page header
// We can then directly reference these icons without making an extra request
gulp.task('svg', function () {
	var svgs = gulp
		.src(imgDev + '/**/*.svg')
		.pipe(svgmin(function (file) {
			var prefix = path.basename(file.relative, path.extname(file.relative));
			return {
				plugins: [
					{
						removeDoctype: true
					},
					{
						removeUselessDefs: true
					},
					{
						removeTitle: true
					},
					{
						cleanupIDs: {
							prefix: prefix + '-',
							minify: true
						}
					}
				]
			}
		}))
		.pipe(svgstore({ inlineSvg: true }));

		function fileContents (filePath, file) {
			return file.contents.toString();
		}

		return gulp.src("./" + htmlDist + "/**/*.html")
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(gulp.dest('./' + htmlDist + '/'));
});

gulp.task('images', function(){
	runSequence(
		"bitmap",
		"svg"
	);
});


// JS
//--------------------------------------------------------------------------------------------------------------------------------------

gulp.task('js', function() {
	var files = glob.sync('./' + jsDev + '/*.js');
	files.map(function(file) {
		var name = file.replace('./' + jsDev + '/', '');
		name = name.replace('.js', '');
		return browserify({entries: file})
		.transform('babelify', {presets: ['es2015']})
		.bundle()
		.pipe(source(file))
		.pipe(gulpif(minify, rename({ 
			dirname: "",
			basename: name,
			suffix: ".min",
			extname: ".js"
		}), rename({ 
			dirname: "",
			basename: name,
			extname: ".js"
		})))
		.pipe(gulpif(minify, streamify(uglify())))
		.pipe(gulp.dest('./' + jsDist + '/'));
	});
});


// HTML
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Setup Marked for Nunjuck as per:
https://gist.github.com/kerryhatcher/1382950af52f3082ecdc668bba5aa11b
*/


var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(htmlDev));
var articles = require("./dev/data/articles.js");
var portfolio = require("./dev/data/portfolio.js");

marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
});

markdown.register(env, marked);

// Process all normal pages
gulp.task('html-copy', function() {
	gulp.src('./' + htmlDev +'/*.html')
	.pipe(gulpNunjucks.compile({
		articles: articles,
		portfolio: portfolio
	}, {env: env}))
	.pipe(gulp.dest(htmlDist + '/'));
});

// Generate article index pagination
gulp.task('articles-index', function() {
		// Define how many articles per page
	var articlesPerPage = 5,
		// Calc number of pages
		pageNum = Math.ceil(articles.length / articlesPerPage),
		// Duplicate articles so we can remove stuff without affecting global list
		articlesList = articles.slice(),
		// Set up loop for while loop
		// Start at 1
		k = 1,
		// Set up variable to determine if we should name a page index.html
		indexToCome = true

	// While loop
	while(articlesList.length){
		// If we have a block of 3 add that
		if(articlesList.length >= articlesPerPage) {
			var articlesToAdd = articlesList.splice(0, articlesPerPage);
		}
		// If no more blocks of 3 remain, just add what's left
		else {
			var articlesToAdd = articlesList;
			articlesList = [];
		}
		// Process list of articles
		gulp.src('./' + htmlDev +'/articles/articles-index.html')
		.pipe(gulpNunjucks.compile({
			articles: articlesToAdd,
			currentPage: k,
			pageNum: pageNum
		}, {env: env}))
		.pipe(gulpif(indexToCome, rename("articles-index.html"), rename(k + ".html")))
		.pipe(gulp.dest(htmlDist + '/articles/'));
		// Incrememt while int
		k++;
		// Flag that index has been processed
		indexToCome = false;
	}
});


// Generate articles without a host property
// We don't need pages generated for articles hosted externally
gulp.task('articles-pages', function() {
	for(var i = 0; i < articles.length; i++) {
		if(!articles[i].host) {
			console.log("Generated " + articles[i].title);
			gulp.src('./' + htmlDev +'/articles/article-template.html')
			.pipe(gulpNunjucks.compile({
				article: articles[i]
			}, {env: env}))
			.pipe(rename(articles[i].slug + ".html"))
			.pipe(gulp.dest(htmlDist + '/articles/'));
		}
	}
});

gulp.task('articles', function(){
	runSequence(
		"articles-index",
		"articles-pages"
	);
});


/*
HTML task need to also run SVG task as SVG task copies master file into html document.
It also needs to run SASS task as new CSS classes may have been used which need to be added to
the compiled CSS file.
*/

gulp.task('html', function(){
	runSequence(
		"html-copy",
		"articles",
		"sass",
		"svg"
	);
});

// Sitemap task
gulp.task('sitemap', function () {
	gulp.src('./' + htmlDist + '/**/*.html', {
		read: false
	})
	.pipe(sitemap({
		siteUrl: "http://www.lukeharrison.net",
		mappings: [{
			pages: [ '**/*.html' ],
			changefreq: 'monthly',
			lastmod: Date.now(),
			hreflang: [{
			    lang: 'en-GB',
			    getHref(siteUrl, file, lang, loc) {
			        return siteUrl + file;
			    }
			}],
			getLoc(siteUrl, loc, entry) {
				// Tweak some URLs manually
				if(loc.includes("portfolio-plusnet")) {
					return siteUrl + "portfolio/plusnet";
				}
				else if(loc.includes("portfolio-redhq")) {
					return siteUrl + "portfolio/red-hq";
				}
				else if(loc.includes("portfolio-sideprojects")) {
					return siteUrl + "portfolio/side-projects";
				}
				else if(loc.includes("articles-index")) {
					return siteUrl + "articles";
				}
				else {
					// Removes the file extension if it exists
					return loc.replace(/\.\w+$/, '');
				}
			}
		}]
	}))
	.pipe(gulp.dest('./' + htmlDist));
});


// PHP / SQL
//--------------------------------------------------------------------------------------------------------------------------------------

/* Copy PHP & SQL files across and keep their directory structure intact */
gulp.task("php", function() {
	return gulp.src('./' + dev + '/**/*.+(php|sql)')
	.pipe(gulp.dest(dist + '/'));
});


// MISC
//--------------------------------------------------------------------------------------------------------------------------------------

// Copy Misc Files Task
gulp.task('copy', function() {

	// Copy all non-directory files
	gulp.src(dev + '/*.+(xml|txt|json)')
	.pipe(gulp.dest(dist + '/'));

	// Copy specified folders and contents
	gulp.src('*/+(fonts)/**', {base:"./" + dev + "/"})
	.pipe(gulp.dest(dist + '/'));

	// Copy HTACCESS file seperately as it wouldn't play nice
	gulp.src(dev + '/.htaccess')
	.pipe(gulp.dest(dist + '/'));
});


//--------------------------------------------------------------------------------------------------------------------------------------
// PRODUCTION FUNCTIONS
//--------------------------------------------------------------------------------------------------------------------------------------

/*
Here we pull everything together into generic watch and build functions
*/

// WATCH FUNCTION
gulp.task("watch", function() {
	// HTML
	gulp.watch(htmlDev + '/**/*.html',['html']);
	// PHP & MYSQL
	gulp.watch(dev + '/**/*.(php|sql)',['php']);
	// Images
	gulp.watch(imgDev + '/*.+(png|jpg|gif|svg)',['images']);
	// SASS
	// UNCSS doesn't run for watch task to speed things up
	gulp.watch(sassDev + '/**/*.scss',['sass-watch']);
	// JS
	gulp.watch(jsDev + '/**/*.js',['js']);
});

// BUILD FUNCTION
gulp.task('build',function() {
	runSequence(
		// Delete Dist Folder
		"deleteDist",
		["html-copy", "articles"],
		// Run other tasks synchronously 
		["php", "sass-build", "js", "copy"],
		"images"
	);
});