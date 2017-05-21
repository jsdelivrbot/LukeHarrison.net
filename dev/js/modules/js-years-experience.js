/*
|--------------------------------------------------------------------
| GENERATE CURRENT YEAR
|--------------------------------------------------------------------
*/	

module.exports = (function(document){
	var year = document.querySelector(".js-years-experience");

	if(year) {
		var legacyDate = "July 01 2010",
			date = new Date().getFullYear();

		legacyDate = new Date(legacyDate).getFullYear();
		date = date - legacyDate;
		year.innerText = date;
	}
})(document);