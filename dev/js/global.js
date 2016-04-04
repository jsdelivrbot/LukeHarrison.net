/*
|--------------------------------------------------------------------
|  FEATURE ANIMATION
|--------------------------------------------------------------------
*/

(function(){

	// Check if clip-paths are supported function
	// http://stackoverflow.com/questions/27558996/how-can-i-test-for-clip-path-support
	var areClipPathShapesSupported = function () {

		var base = 'clipPath',
			prefixes = [ 'webkit', 'moz', 'ms', 'o' ],
			properties = [ base ],
			testElement = document.createElement( 'testelement' ),
			attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)';

		// Push the prefixed properties into the array of properties.
		for ( var i = 0, l = prefixes.length; i < l; i++ ) {
			var prefixedProperty = prefixes[i] + base.charAt( 0 ).toUpperCase() + base.slice( 1 ); // remember to capitalize!
			properties.push( prefixedProperty );
		}

		// Interate over the properties and see if they pass two tests.
		for ( var i = 0, l = properties.length; i < l; i++ ) {
			var property = properties[i];

			// First, they need to even support clip-path (IE <= 11 does not)...
			if ( testElement.style[property] === '' ) {

				// Second, we need to see what happens when we try to create a CSS shape...
				testElement.style[property] = attribute;
				if ( testElement.style[property] !== '' ) {
					return true;
				}
			}
		}

		return false;
	};

	var banner = document.querySelector(".banner--about");
	var full = document.querySelector(".feature-full");
	var lines = document.querySelector(".feature-lines");
	var defaultWidth;
	var defaultHeight;
	var pos = window.innerWidth / 2;
	var clipPath = areClipPathShapesSupported();

	var resetBanner = function(){
		if(clipPath){
			full.style.setProperty("-webkit-clip-path", "inset(0 0 0 50%)"); 
		}
		else {
			defaultWidth = window.innerWidth;
			defaultHeight = window.innerHeight;
			full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${defaultWidth*0.4952}px)`);
		}
	};

	// Set to default
	resetBanner(); 

	// Reposition on window resize
	window.onresize = function(){
		resetBanner(); 
	}

	if(!Modernizr.touchevents && bp.min("med")){ 

		banner.addEventListener("mouseenter", function(){
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
		});

		banner.addEventListener("mouseleave", function(){
			full.classList.add("inactive");
			resetBanner();  
		});

	}
	// else if(Modernizr.touchevents) {

	// 	banner.addEventListener("touchmove", function(e){
	// 		e.preventDefault();
	// 		full.classList.remove("inactive");
	// 		pos = e.touches[0].clientX;
	// 		full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${pos}px)`);
	// 	});

	// 	banner.addEventListener("touchend", function(e){
	// 		full.classList.add("inactive");
	// 		resetBanner(); 
	// 	});
	// }

})();