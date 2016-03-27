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

	var bannerOver = function(){
		full.classList.remove("inactive");
		banner.onmousemove = function(e){
			x = window.innerWidth - e.pageX;
			full.style.setProperty("-webkit-clip-path", `inset(0 0 0 ${x}px)`);
		};
	};

	banner.addEventListener("mouseover", bannerOver);

	banner.addEventListener("mouseout", function(){
		full.classList.add("inactive");
		full.style.removeProperty("-webkit-clip-path");
	});

})();