
module.exports = (function(){

	var Modernizr = require("../vendor/modernizr-custom.js");

	/*
	|--------------------------------------------------------------------
	| GENERATE CURRENT YEAR
	|--------------------------------------------------------------------
	*/	

	var year = document.querySelector(".year");	
	year.innerText = (new Date).getFullYear();

	/*
	|--------------------------------------------------------------------
	| DISABLE LOADER ON PAGE LOAD
	|--------------------------------------------------------------------
	*/	

	window.onload = function(){

		var body = document.querySelector("body"),
			feature = document.querySelector(".banner--about.animated .feature-full");

		// Remove loader icon
		body.classList.remove("loading");

		// If on about page start feature animation
		if(body.classList.contains("about")){
			feature.style.animationPlayState = "running"; 
		}
	};

})();