module.exports = (function(document, window){ 

	/*
	|--------------------------------------------------------------------
	| DEFINE MODULES
	|--------------------------------------------------------------------
	*/

	const bp = (function(){

		var convertToNum = function(obj){
			let newObj = {};
			for(var key in obj){
				newObj[key] = parseFloat(obj[key]);
			}
			return newObj;
		};

		/* inject: Breakpoints JSON */
		/* endinject */

		var bpObj = convertToNum(bpData["breakpoints"]);

		return {

			// Breakpoint detection function
			// eg: if(bp.min("med")){
			min: function(size){
				if(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth >= bpObj[size]) {
					return true;
				}
				else {
					return false;
				}
			},

			max: function(size){
				if(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth <= bpObj[size]) {
					return true;
				}
				else {
					return false;
				}
			},

			between: function(from, to){
				if(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth >= bpObj[from] && window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth <= bpObj[to]) {
					return true;
				}
				else {
					return false;
				}
			}
		};

	})();


	/*
	|--------------------------------------------------------------------
	| GENERATE CURRENT YEAR
	|--------------------------------------------------------------------
	*/
	var year = document.querySelector(".year");
	year.textContent = (new Date).getFullYear();


})(document, window);