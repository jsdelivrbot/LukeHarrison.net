/*
|--------------------------------------------------------------------
|  FEATURE ANIMATION
|--------------------------------------------------------------------
*/

(function(){

	var banner = document.querySelector(".banner--about");
	var full = document.querySelector(".feature-full");
	var lines = document.querySelector(".feature-lines");
	var defaultWidth;
	var defaultHeight;
	var pos = window.innerWidth / 2;

	var resetBanner = function(){
		defaultWidth = window.innerWidth;
		defaultHeight = window.innerHeight;
		full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${defaultWidth*0.4952}px)`);
	};

	// Set to default
	resetBanner(); 

	// Reposition on window resize
	window.onresize = function(){
		resetBanner(); 
	}

	if(!Modernizr.touchevents){ 

		banner.addEventListener("mouseover", function(){
			full.classList.remove("inactive");
			banner.onmousemove = function(e){
				pos = window.innerWidth - e.pageX;
				full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${pos}px)`);
			};
		});

		banner.addEventListener("mouseout", function(){
			full.classList.add("inactive");
			resetBanner(); 
		});

	}
	else if(Modernizr.touchevents) {

		banner.addEventListener("touchmove", function(e){
			e.preventDefault();
			full.classList.remove("inactive");
			pos = e.touches[0].clientX;
			full.style.setProperty("clip", `rect(0px, ${defaultWidth}px, ${defaultHeight}px, ${pos}px)`);
		});

		banner.addEventListener("touchend", function(e){
			full.classList.add("inactive");
			resetBanner(); 
		});
	}

})();