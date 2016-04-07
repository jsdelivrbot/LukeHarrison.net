/*
|--------------------------------------------------------------------
|  LAST-CHILD REPLACEMENT FOR 
|--------------------------------------------------------------------
*/

(function(){

	// Exit prematurely if not on about page as no need to run this module
	if(!document.querySelector("body").classList.contains("about")){
		return false;
	}

	var boxes = document.querySelectorAll(".about__skills .text-box");

	for(var i = 0, item; i < boxes.length; i++) {
		item = boxes[i].querySelectorAll("li");
		item[item.length - 1].classList.add("ie8");
	}

})();