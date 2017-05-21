/*
|--------------------------------------------------------------------
| JS-LOADER
|--------------------------------------------------------------------
*/

module.exports = (function(){

	var prefixedEvent = require("../vendor/prefixedEvent.js"),
		body = document.querySelector("body"),
		loader = document.querySelector(".js-loader"),
		feature = document.querySelector(".js-feature.is-animated .js-feature-developer"),
		removeLoader;

	removeLoader = function(){
		loader.style.display = "none";
	};

	// This is breaking loader
	if(Modernizr.cssanimations){
		prefixedEvent(loader, "TransitionEnd", removeLoader);
	}
	
	// Define loader close behaviour 
	window.onload = function(){

		// Remove loader icon
		body.classList.remove("is-loading");

		// If on about page start feature animation
		if(body.classList.contains("js-about")){			
			feature.style.animationPlayState = "running"; 
			feature.style.webkitAnimationPlayState = "running"; 
		}
	};

})();