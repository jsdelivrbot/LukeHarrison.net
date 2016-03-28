/*
|--------------------------------------------------------------------
|  FEATURE ANIMATION
|--------------------------------------------------------------------
*/

(function(){
	var banner = document.querySelector(".banner--about");
	var full = document.querySelector(".feature-full");
	var lines = document.querySelector(".feature-lines");

	var x = window.innerWidth / 2;
	var oldX;

	if(!Modernizr.touchevents){ 

		banner.addEventListener("mouseover",  function(){
			full.classList.remove("inactive");
			banner.onmousemove = function(e){
				x = window.innerWidth - e.pageX;
				full.style.setProperty("-webkit-clip-path", `inset(0 0 0 ${x}px)`);
			};
		});

		banner.addEventListener("mouseout", function(){
			full.classList.add("inactive");
			full.style.removeProperty("-webkit-clip-path");
		});

	}
	else if(Modernizr.touchevents) {

		banner.addEventListener("touchmove", function(e){
			e.preventDefault();
			full.classList.remove("inactive");
			x = e.touches[0].clientX;
			full.style.setProperty("-webkit-clip-path", `inset(0 0 0 ${x}px)`);
			full.style.setProperty("clip-path", `inset(0 0 0 ${x}px)`);
		});

		banner.addEventListener("touchend", function(e){
			full.classList.add("inactive");
			document.querySelector(".feature-full").removeAttribute("style");
			//document.querySelector("h1").style.setProperty("display", "none");
		});
	}

})();