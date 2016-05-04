
module.exports = (function(){

	var Modernizr = require("../vendor/modernizr-custom.js");
	var prefixedEvent = require("../vendor/prefixedEvent.js");

	/*
	|--------------------------------------------------------------------
	| GENERATE CURRENT YEAR
	|--------------------------------------------------------------------
	*/	

	(function(document){
		var year = document.querySelector(".year");	
		year.innerText = (new Date).getFullYear();
	})(document);

	/*
	|--------------------------------------------------------------------
	| DISABLE LOADER ON PAGE LOAD
	|--------------------------------------------------------------------
	*/	

	(function(document, window, prefixedEvent){
		var body = document.querySelector("body"),
			loader = document.querySelector(".loader"),
			feature = document.querySelector(".banner--about.animated .feature-full"),
			removeLoader;

		removeLoader = function(){
			loader.style.display = "none";
		};

		if(loader.addEventListener && Modernizr.cssanimations){
			prefixedEvent(loader, "TransitionEnd", removeLoader);
		}
		else {
			removeLoader();
		}

		// Define loader close behaviour 
		window.onload = function(){

			// Remove loader icon
			body.classList.remove("loading");

			// If on about page start feature animation
			if(body.classList.contains("about")){
				feature.style.animationPlayState = "running"; 
			}
		};
	})(document, window, prefixedEvent);

})();