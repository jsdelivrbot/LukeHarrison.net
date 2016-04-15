module.exports = (function(){

	/*
	|--------------------------------------------------------------------
	| GENERATE CURRENT YEAR
	|--------------------------------------------------------------------
	*/

	var year = document.querySelector(".year");
	year.textContent = (new Date).getFullYear();
	
})();