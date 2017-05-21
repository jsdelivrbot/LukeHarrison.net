/*
|--------------------------------------------------------------------
| GENERATE CURRENT YEAR
|--------------------------------------------------------------------
*/	

module.exports = (function(document){
	var year = document.querySelector(".js-year");
	if(year) {
		year.innerText = (new Date).getFullYear();
	}
})(document);