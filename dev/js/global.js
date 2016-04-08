"use strict";

/*
|--------------------------------------------------------------------
|  FEATURE ANIMATION
|--------------------------------------------------------------------
*/

// Pass in window and document object to increase lookup speed
(function(window, document){ 

	// Exit prematurely if not on about page as no need to run this module
	if(!document.querySelector("body").classList.contains("about")){
		return false;
	}

	// Check if clip-paths are supported function
	// http://stackoverflow.com/questions/27558996/how-can-i-test-for-clip-path-support
	var areClipPathShapesSupported = function () {var base = 'clipPath', prefixes = [ 'webkit', 'moz', 'ms', 'o' ], properties = [ base ], testElement = document.createElement( 'testelement' ), attribute = 'inset(0 0 0 50%)'; for ( var i = 0, l = prefixes.length; i < l; i++ ) {var prefixedProperty = prefixes[i] + base.charAt( 0 ).toUpperCase() + base.slice( 1 ); properties.push( prefixedProperty ); } for ( var i = 0, l = properties.length; i < l; i++ ) {var property = properties[i]; if ( testElement.style[property] === '' ) {testElement.style[property] = attribute; if ( testElement.style[property] !== '' ) {return true; } } } return false; },

		// Set or declare variables
		banner = document.querySelector(".banner--about"),
		full = document.querySelector(".feature-full"),
		lines = document.querySelector(".feature-lines"),
		fullText = document.querySelector(".feature-text--developer"),
		linesText = document.querySelector(".feature-text--designer"),
		pos = document.body.clientWidth / 2 || document.documentElement.clientWidth / 2,
		clipPath = areClipPathShapesSupported(),
		moveWidth = document.body.clientWidth || document.documentElement.clientWidth,
		moveHeight = document.body.clientHeight + 300 || document.documentElement.clientHeight + 300,
		opacityLines,
		opacityFull,
		bannerEnter,
		bannerLeave,

		// Create function to set default feature state
		resizeBanner = function(){
			// Reinitialise with current document width and height
			moveWidth = document.body.clientWidth || document.documentElement.clientWidth;
			moveHeight = document.body.clientHeight + 300 || document.documentElement.clientHeight + 300; 

			// Reset vertical line
			if(!clipPath){
				full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;
			}
		},

		bannerToDefault = function(){
			if(!clipPath){
				full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;
			}
			else {
				full.style.setProperty("-webkit-clip-path", "inset(0 0 0 50%)");
			}	
		};
	
	// Run once to initialise feature
	bannerToDefault();

	// On window resize get new document dimensions and recrop if not clip-path
	window.onresize = function(){
		resizeBanner();  
	}

	// Define function which fires when mouse enters feature
	bannerEnter = function(){

		// If no touch events and if higher then the med breakpoint then enable interaction
		if(bp.min("med")){

			banner.classList.remove("inactive");

			// Define what happens as mouse moves
			banner.onmousemove = function(e){
				e = e || window.event;
				pos = e.pageX || e.clientX
				pos = moveWidth - pos;

				//Move vertical line
				if(clipPath){ 
					full.style.setProperty("-webkit-clip-path", `inset(0 0 0 ${pos}px)`); 
				}
				else {
					full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${pos}px)`;
				}
			};
		}
	};

	// Define function which fires when mouse leaves feature
	bannerLeave = function(){
		if(bp.min("med")){
			banner.classList.add("inactive");
			bannerToDefault();
		}
	};

	// Attach event liseners if not touch device and if not available use legacy attachEvent
	if(!Modernizr.touchevents){
		if(banner.addEventListener){
			banner.addEventListener("mouseenter", bannerEnter);
			banner.addEventListener("mouseleave", bannerLeave);
		}
		else {
			banner.attachEvent("onmouseenter", bannerEnter);
			banner.attachEvent("onmouseleave", bannerLeave); 
		}
	}

})(window, document);