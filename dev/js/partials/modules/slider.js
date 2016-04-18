module.exports = (function(document){

	var slider = document.querySelectorAll(".portfolio-item__screens"),
		length = slider.length,
		i,
		sliderControl,
		target,
		active,
		next,
		previous,
		parent;

	sliderControl = function(e){
		target = e.target || e.srcElement;
		parent = e.path[2];
		active = parent.querySelector(".portfolio-item__slide.active");

		if(target.classList.contains("portfolio-items__controls-prev")){
			next = active.previousElementSibling;
		}
		else if(target.classList.contains("portfolio-items__controls-next")){
			next = active.nextElementSibling; 
		}
		else {
			next = false;
		}

		if(next){
			if(active.classList.contains("active")){
				active.classList.remove("active"); 

				if(target.classList.contains("portfolio-items__controls-next")){
					active.classList.add("prev");
				}
			}
			if(!next.classList.contains("active")) {
				next.classList.add("active");
				next.classList.remove("prev");
			}
		}
	}

	for(i = 0; i < length; i++) {
		if(slider[i].addEventListener){
			slider[i].addEventListener("click", function(e){
				sliderControl(e);
			});
		}
		else {
			slider[i].attachEvent("onclick", function(e){
				sliderControl(e); 
			}); 
		}
	}



})(document);