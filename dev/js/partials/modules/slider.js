module.exports = (function(document, window){

	var classList = require("../polyfills/classlist.js");
	var indexof = require("../polyfills/indexof.js");
	var getClosest = require("../vendor/getClosest.js");
	var swipeDetect = require("../vendor/swipeDetect.js");
	var layzr = require("layzr.js");

	var slider = document.querySelectorAll(".portfolio-item__screens.multiple"),
		scrollSlides = document.querySelectorAll(".portfolio-item__slide.scroll .portfolio-item__screen"),
		noScrollSlide = document.querySelector(".portfolio-item__slide.noScroll .portfolio-item__screen img"),
		noScrollSlideHeight,
		length = slider.length, 
		i,
		d,
		sliderClick,
		sliderMove,
		sliderKey,
		sliderSetup,
		slideHeight,
		target,
		active,
		next,
		previous,
		parent,
		screenContainer,
		slides,
		activePos;

	const instance = layzr({
		normal: 'data-normal',
		retina: 'data-retina',
		srcset: 'data-srcset',
		threshold: 0
	})


	document.addEventListener('DOMContentLoaded', event => {
		instance
			.update()           // track initial elements
			.check()            // check initial elements
			.handlers(true)     // bind scroll and resize handlers
	})

	sliderClick = function(e){

		target = e.target || e.srcElement;
		parent = getClosest(target, '.portfolio-item__screens');

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
		slides = screenContainer.querySelectorAll(".portfolio-item__slide"); 

		if(direction === "next") {
			if(active.nextElementSibling || active.nextSibling){
				//activePos = (slides.indexOf(active) + 1);
				activePos = Array.prototype.indexOf.call(slides, active);
				activePos = activePos + 1;
				next = active.nextElementSibling || active.nextSibling;
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
			else {
				next =  screenContainer.firstChild;
				activePos = 0;
				for(i = 0; i < slides.length; i++){
					slides[i].classList.remove("prev");
				}
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
		}
		else if (direction === "previous") {
			if(active.previousElementSibling || active.previousSibling){
				//activePos = (slides.indexOf(active) - 1);
				activePos = Array.prototype.indexOf.call(slides, active);
				activePos = activePos - 1;
				next = active.previousElementSibling || active.previousSibling;
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
			else {
				next =  screenContainer.lastChild;
				//activePos = slides.indexOf(screenContainer.lastChild);
				activePos = Array.prototype.indexOf.call(slides, screenContainer.lastChild);
				for(i = 0; i < slides.length; i++){
					slides[i].classList.add("prev");
				}
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
		}

		if(direction && next){
			if(active.classList.contains("active")){
				active.classList.remove("active");
				if(direction === "next" && active.nextElementSibling || direction === "next" && active.nextSibling){
					active.classList.add("prev");
				}
			}
			if(!next.classList.contains("active")) {
				next.classList.add("active");
				next.classList.remove("prev");
			}
		}
	}

	sliderSetup = (function(slider, Modernizr){
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
				swipeDetect(slider[i], function(swipedir, eventObj){
			
					parent = getClosest(eventObj.target, '.portfolio-item__screens');

					if (swipedir == 'right') {
						sliderMove("previous", parent);
					}
					if (swipedir == 'left') {
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
	})(slider, Modernizr);


})(document, window);