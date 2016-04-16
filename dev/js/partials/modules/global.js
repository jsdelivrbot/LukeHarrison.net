
module.exports = (function(){

	var Modernizr = require("../vendor/modernizr-custom.js");

	/*
	|--------------------------------------------------------------------
	| GENERATE CURRENT YEAR
	|--------------------------------------------------------------------
	*/

	

	var year = document.querySelector(".year");	
	year.innerText = (new Date).getFullYear();

})();