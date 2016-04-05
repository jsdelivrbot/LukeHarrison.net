/*
|--------------------------------------------------------------------
|  FEATURE ANIMATION
|--------------------------------------------------------------------
*/

// Pass in window and document object to increase lookup speed
(function(window, document){

	"use strict";

	// Check if clip-paths are supported function
	// http://stackoverflow.com/questions/27558996/how-can-i-test-for-clip-path-support
	var areClipPathShapesSupported = function () {var base = 'clipPath', prefixes = [ 'webkit', 'moz', 'ms', 'o' ], properties = [ base ], testElement = document.createElement( 'testelement' ), attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)'; for ( var i = 0, l = prefixes.length; i < l; i++ ) {var prefixedProperty = prefixes[i] + base.charAt( 0 ).toUpperCase() + base.slice( 1 ); properties.push( prefixedProperty ); } for ( var i = 0, l = properties.length; i < l; i++ ) {var property = properties[i]; if ( testElement.style[property] === '' ) {testElement.style[property] = attribute; if ( testElement.style[property] !== '' ) {return true; } } } return false; },

		// Set variables, cas
		banner = document.querySelector(".banner--about"),
		full = document.querySelector(".feature-full"),
		lines = document.querySelector(".feature-lines"),
		defaultWidth,
		defaultHeight,
		pos = window.innerWidth / 2,
		clipPath = areClipPathShapesSupported(),

	// Create function to set default feature state
		resetBanner = function(){
			if(clipPath){
				full.style.setProperty("-webkit-clip-path", "inset(0 0 0 50%)"); 
			}
			else {
				defaultWidth = window.innerWidth;
				defaultHeight = (window.innerHeight + 100);
				full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${defaultWidth*0.4952}px)`);
			}
		};

	// Set to default feature state
	resetBanner(); 

	// If no touch events and if higher then the med breakpoint then enable interaction
	if(!Modernizr.touchevents && bp.min("med")){

		// Reposition on window resize if we're forced to use clip instead of clip-path
		if(!clipPath){
			window.onresize = function(){
				resetBanner(); 
			}
		}

		// Define function which fires when mouse enters feature
		var bannerEnter = function(){
			full.classList.remove("inactive");
				banner.onmousemove = function(e){
					pos = window.innerWidth - e.pageX;
					if(clipPath){
						full.style.setProperty("-webkit-clip-path", `inset(0 0 0 ${pos}px)`); 
					}
					else {
						full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${pos}px)`);
					}
				};
		},

		// Define function which fires when mouse leaves feature
			bannerLeave = function(){
				full.classList.add("inactive");
				resetBanner();
		};

		// Attach event liseners and if not availble use legacy attachEvent
		if(banner.addEventListener){
			banner.addEventListener("mouseenter", bannerEnter);
			banner.addEventListener("mouseleave", bannerLeave);
		}
		else {
			banner.attachEvent("mouseenter", bannerEnter);
			banner.attachEvent("mouseleave", bannerLeave);
		}

	}

})(window, document);