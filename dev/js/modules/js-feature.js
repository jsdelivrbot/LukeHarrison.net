// Pass in window and document object to increase lookup speed
module.exports = (function(window, document){

	/*
	|--------------------------------------------------------------------
	|  FEATURE ANIMATION
	|--------------------------------------------------------------------
	*/

	var bp = require("orionjs/helpers/breakpoints.js");
	var prefixedEvent = require("../vendor/prefixedEvent.js");

	// Exit prematurely if we don't have a js-feature as need to run this module
	if(!document.querySelector(".js-feature")){
		return false;
	}

	// Check if clip-paths are supported function
	// http://stackoverflow.com/questions/27558996/how-can-i-test-for-clip-path-support
	var areClipPathShapesSupported = function () {var base = 'clipPath', prefixes = [ 'webkit', 'moz', 'ms', 'o' ], properties = [ base ], testElement = document.createElement( 'testelement' ), attribute = 'inset(0 0 0 50%)'; for ( var i = 0, l = prefixes.length; i < l; i++ ) {var prefixedProperty = prefixes[i] + base.charAt( 0 ).toUpperCase() + base.slice( 1 ); properties.push( prefixedProperty ); } for ( var i = 0, l = properties.length; i < l; i++ ) {var property = properties[i]; if ( testElement.style[property] === '' ) {testElement.style[property] = attribute; if ( testElement.style[property] !== '' ) {return true; } } } return false; },

		// Set or declare variables
		banner = document.querySelector(".js-feature"),
		full = document.querySelector(".js-feature-developer"),
		lines = document.querySelector(".js-feature-designer"),
		pos = document.body.clientWidth / 2 || document.documentElement.clientWidth / 2,
		clipPath = areClipPathShapesSupported(),
		moveWidth = document.body.clientWidth || document.documentElement.clientWidth,
		moveHeight = document.body.clientHeight + 300 || document.documentElement.clientHeight + 300,
		isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
		bannerEnter,
		bannerLeave,
		bannerAnimation,
		bannerLoad,
		resizeBanner,
		bannerToDefault,
		bannerReset,
		anim0,	anim10, anim50, anim60, anim100;

	// Create function to set default feature state
	resizeBanner = function(){
		// Reinitialise with current document width and height
		moveWidth = document.body.clientWidth || document.documentElement.clientWidth;
		moveHeight = document.body.clientHeight + 300 || document.documentElement.clientHeight + 300;

		// Reset vertical line
		if(!clipPath || isSafari){
			full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;
		}
	};

	// Define function which fires when About banner has loaded so legacy intro animation can begin
	bannerLoad = function(){
		anim0 = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth}px)`;
		anim10 = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth}px)`;
		anim50 = `rect(0px, ${moveWidth}px, ${moveHeight}px, 0px)`;
		anim60 = `rect(0px, ${moveWidth}px, ${moveHeight}px, 0px)`;
		anim100 = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;

		// dynamically add new @keyframes into head for legacy animation
		var style = document.createElement('style');
		style.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(style);
		style.innerHTML = `
			@keyframes banner-animate-legacy {
				0%	{
					clip: ${anim0}
				}
				5% {
					clip: ${anim10}
				}
				50% {
					clip: ${anim50}
				}
				55% {
					clip: ${anim60}
				}
				100% {
					clip: ${anim100}
				}
			}
			@keyframes banner-animate-legacy {
				0%	{
					clip: ${anim0}
				}
				5% {
					clip: ${anim10}
				}
				50% {
					clip: ${anim50}
				}
				55% {
					clip: ${anim60}
				}
				100% {
					clip: ${anim100}
				}
			}
		`
	};

	bannerReset = function(){
		if(!clipPath || isSafari){
			full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;
		}
		else {
			full.style.setProperty("clip-path", "inset(0 0 0 50%)");
		}
	};

	bannerToDefault = function(){

		if(!clipPath || isSafari){
			document.querySelector("body").classList.add("no-clip-path");
			// if browser supports CSS animations then run load animation else clear animation blocking class
			if(Modernizr.cssanimations) {
				bannerLoad();
			}
			else {
				bannerAnimation();
			}
			bannerReset();
		}
		else {
			document.querySelector("body").classList.add("clip-path");
			full.style.setProperty("clip-path", "inset(0 0 0 50%)");
		}
	};

	// On window resize get new document dimensions and recrop if not clip-path
	window.onresize = function(){
		resizeBanner();
	}

	// Define function which fires when mouse enters feature
	bannerEnter = function(){
		// If no touch events and if higher then the med breakpoint then enable interaction
		if(bp.min("740px") && !banner.classList.contains("is-animated")){

			if(banner.classList.contains("is-inactive")) {
				banner.classList.remove("is-inactive");
			}

			// Define what happens as mouse moves
			banner.onmousemove = function(e){
				e = e || window.event;
				pos = e.pageX || e.clientX
				pos = moveWidth - pos;

				//Move vertical line
				if(clipPath && !isSafari){
					full.style.setProperty("clip-path", `inset(0 0 0 ${pos}px)`);
				}
				else {
					full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${pos}px)`;
				}
			};
		}
	};

	// Define function which fires when mouse leaves feature
	bannerLeave = function(){
		if(bp.min("740px") && !banner.classList.contains("is-animated")){
			if(!banner.classList.contains("is-inactive")) {
				banner.classList.add("is-inactive");
			}
			bannerReset();
		}
	};

	// Define function which fires when CSS animation intro has ended
	bannerAnimation = function(){
		if(banner.classList.contains("is-animated")) {
			banner.classList.remove("is-animated");
		}
	};

	// Attach event liseners if not touch device and if not available use legacy attachEvent
	if(!Modernizr.touchevents){

		if(banner.addEventListener){
			prefixedEvent(full, "AnimationEnd", bannerAnimation);
			banner.addEventListener("mouseover", bannerEnter);
			banner.addEventListener("mouseleave", bannerLeave);
		}
		else {
			banner.attachEvent("onmouseenter", bannerEnter);
			banner.attachEvent("onmouseleave", bannerLeave);
		}
	}

	// Run once to initialise feature
	bannerToDefault();

})(window, document);
