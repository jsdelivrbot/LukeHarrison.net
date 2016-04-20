module.exports = (function(document, window){

	var classList = require("../polyfills/classlist.js");
	var Modernizr = require("../vendor/modernizr-custom.js"); 
	var getClosest = require("../vendor/getClosest.js");
	var swipeDetect = require("../vendor/swipeDetect.js");

	var slider = document.querySelectorAll(".portfolio-item__screens.multiple"),
		length = slider.length,
		i,
		d,
		sliderClick,
		sliderMove,
		sliderKey,
		sliderSetup,
		target,
		active,
		next,
		previous,
		parent,
		screenContainer,
		slides,
		activePos;

	sliderClick = function(e){
		target = e.target || e.srcElement;
		parent = getClosest(e.target, '.portfolio-item__screens');

		if(target.classList.contains("portfolio-items__controls-prev")){
			sliderMove("previous", parent);
		}
		else if(target.classList.contains("portfolio-items__controls-next")){
			sliderMove("next", parent);
		}
		else {
			return false;
		}
	}

	sliderMove = function(direction, parent){
		active = parent.querySelector(".portfolio-item__slide.active");
		screenContainer = parent.querySelector(".portfolio-item__container");
		slides = Array.prototype.slice.call(screenContainer.querySelectorAll(".portfolio-item__slide"));

		if(direction === "next") {
			if(active.nextElementSibling){
				activePos = (slides.indexOf(active) + 1);
				next = active.nextElementSibling;
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
			else {
				next =  screenContainer.firstChild;
				activePos = 0;
				slides = screenContainer.querySelectorAll(".portfolio-item__slide"); 
				for(i = 0; i < slides.length; i++){
					slides[i].classList.remove("prev");
				}
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
		}
		else if (direction === "previous") {
			if(active.previousElementSibling){
				activePos = (slides.indexOf(active) - 1);
				next = active.previousElementSibling;
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
			else {
				next =  screenContainer.lastChild;
				activePos = slides.indexOf(screenContainer.lastChild);
				for(i = 0; i < slides.length; i++){
					slides[i].classList.add("prev");
				}
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
		}

		if(direction && next){
			if(active.classList.contains("active")){
				active.classList.remove("active");
				if(direction === "next" && active.nextElementSibling){
					active.classList.add("prev");
				}
			}
			if(!next.classList.contains("active")) {
				next.classList.add("active");
				next.classList.remove("prev");
			}
		}
	}

	sliderSetup = (function(slider){

		 // Add event listeners
		for(i = 0; i < length; i++) {
			// Add click events
			if(slider[i].addEventListener){
				slider[i].addEventListener("click", function(e){ 
					sliderClick(e);
				});
			}
			else {
				slider[i].attachEvent("onclick", function(e){
					sliderClick(e); 
				}); 
			}

			// Add touch events

			if(Modernizr.touchevents){
				swipeDetect(slider[i], function(swipedir){
					
					parent = getClosest(eventObj.target, '.portfolio-item__screens');

					if (swipedir == 'right') {
						console.log("right")
						sliderMove("previous", parent);
					}
					if (swipedir == 'left') {
						console.log("left")
						sliderMove("next", parent); 
					}
				})
			}

			// Size slides & container
			slides = slider[i].querySelectorAll(".portfolio-item__slide");
			screenContainer = slider[i].querySelector(".portfolio-item__container");

			// Set slide width
			for(d = 0; d < slides.length; d++){
				slides[d].style.width = (100 / slides.length) + "%";
			}

			// Set container width
			screenContainer.style.width = (100 * slides.length) + "%";
			screenContainer.style.left = 0 + "%"; 

		}


	})(slider);


})(document, window);