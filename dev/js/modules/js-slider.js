module.exports = (function(document, window){

	var classList = require("../polyfills/classlist.js");
	var indexof = require("../polyfills/indexof.js");
	var getClosest = require("../vendor/getClosest.js");
	var swipeDetect = require("../vendor/swipeDetect.js");
	var layzr = require("layzr.js");

	var slider = document.querySelectorAll(".c-portfolio-item__screens.has-multiple"),
		scrollSlides = document.querySelectorAll(".c-portfolio-item__slide.has-scroll .c-portfolio-item__screen"),
		noScrollSlide = document.querySelector(".c-portfolio-item__slide.no-scroll .c-portfolio-item__screen img"),
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

		e.preventDefault();

		target = e.target || e.srcElement;
		parent = getClosest(target, '.c-portfolio-item__screens');

		if(target.classList.contains("c-portfolio-items__controls-prev")){
			sliderMove("previous", parent);
		}
		else if(target.classList.contains("c-portfolio-items__controls-next")){
			sliderMove("next", parent);
		}
		else {
			return false;
		}
	}

	sliderMove = function(direction, parent){
		active = parent.querySelector(".c-portfolio-item__slide.is-active");
		screenContainer = parent.querySelector(".c-portfolio-item__slide-container");
		slides = screenContainer.querySelectorAll(".c-portfolio-item__slide");

		if(direction === "next") {
			if(active.nextElementSibling){
				activePos = Array.prototype.indexOf.call(slides, active);
				activePos = activePos + 1;
				next = active.nextElementSibling;
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
			else {
				next =  screenContainer.firstElementChild;
				activePos = 0;
				for(i = 0; i < slides.length; i++){
					slides[i].classList.remove("is-prev");
				}
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
		}
		else if (direction === "previous") {
			if(active.previousElementSibling){
				activePos = Array.prototype.indexOf.call(slides, active);
				activePos = activePos - 1;
				next = active.previousElementSibling;
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
			else {
				next =  screenContainer.lastElementChild;
				activePos = Array.prototype.indexOf.call(slides, screenContainer.lastElementChild);
				for(i = 0; i < slides.length; i++){
					slides[i].classList.add("is-prev");
				}
				screenContainer.style.left = "-" + (100 * activePos) + "%";
			}
		}

		if(direction && next){
			if(active.classList.contains("is-active")){
				active.classList.remove("is-active");
				if(direction === "next" && active.nextElementSibling){
					active.classList.add("is-prev");
				}
			}
			if(!next.classList.contains("is-active")) {
				next.classList.add("is-active");
				next.classList.remove("is-prev");
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

					parent = getClosest(eventObj.target, '.c-portfolio-item__screens');

					if (swipedir == 'right') {
						sliderMove("previous", parent);
					}
					if (swipedir == 'left') {
						sliderMove("next", parent);
					}
				})
			}

			// Add keyboard events to cycle backwards/forwards
			slider[i].addEventListener("keydown", function(e){
				// Left arrow
				if(e.which === 37) {
					sliderMove("previous", this);
				}
				else if(e.which === 39) {
					sliderMove("next", this);
				}
			});

			// Size slides & container
			slides = slider[i].querySelectorAll(".c-portfolio-item__slide");
			screenContainer = slider[i].querySelector(".c-portfolio-item__slide-container");

			// Set slide width
			for(d = 0; d < slides.length; d++){
				slides[d].style.width = (100 / slides.length) + "%";
			}

			// Set container width
			screenContainer.style.width = (100 * slides.length) + "%";
			screenContainer.style.left = 0 + "%";
		}
	})(slider, Modernizr);

	// Add scroll capabilities for long screenshots
	for(i = 0; i < scrollSlides.length; i++) {
		scrollSlides[i].addEventListener('touchstart', function(e) {
			console.log(e.type);
		});
		scrollSlides[i].addEventListener('touchmove', function(e) {
			e.preventDefault();
			console.log(e);
		});
		scrollSlides[i].addEventListener('touchend', function(e) {
			console.log(e.type);
		});
	}


})(document, window);
