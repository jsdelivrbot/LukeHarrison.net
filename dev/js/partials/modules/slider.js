module.exports = (function(document){

	var slider = document.querySelectorAll(".portfolio-item__screens"),
		length = slider.length,
		i,
		sliderClick,
		sliderMove,
		sliderKey,
		target,
		active,
		next,
		previous,
		parent,
		eventObj,
		getClosest,
		swipedetect;

	// jquery Closest() vanilla JS function
	// http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
	getClosest = function (elem, selector) {
	    var firstChar = selector.charAt(0);
	    // Get closest match
	    for ( ; elem && elem !== document; elem = elem.parentNode ) {
	        // If selector is a class
	        if ( firstChar === '.' ) {
	            if ( elem.classList.contains( selector.substr(1) ) ) {
	                return elem;
	            }
	        }
	        // If selector is an ID
	        if ( firstChar === '#' ) {
	            if ( elem.id === selector.substr(1) ) {
	                return elem;
	            }
	        } 
	        // If selector is a data attribute
	        if ( firstChar === '[' ) {
	            if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
	                return elem;
	            }
	        }
	        // If selector is a tag
	        if ( elem.tagName.toLowerCase() === selector ) {
	            return elem;
	        }
	    }
	    return false;
	};

	// Swipe detection function
	// http://www.javascriptkit.com/javatutors/touchevents2.shtml
	swipedetect = function(el, callback){
	  
	    var touchsurface = el,
	    swipedir,
	    startX,
	    startY,
	    dist,
	    distX,
	    distY,
	    threshold = 100, //required min distance traveled to be considered swipe
	    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
	    allowedTime = 300, // maximum time allowed to travel that distance
	    elapsedTime,
	    startTime,
	    handleswipe = callback || function(swipedir){}
	  
	    touchsurface.addEventListener('touchstart', function(e){
	        var touchobj = e.changedTouches[0]
	        swipedir = 'none'
	        dist = 0
	        startX = touchobj.pageX
	        startY = touchobj.pageY
	        startTime = new Date().getTime() // record time when finger first makes contact with surface
	        e.preventDefault()
              eventObj = e;
	    }, false)
	  
	    touchsurface.addEventListener('touchmove', function(e){
	        e.preventDefault() // prevent scrolling when inside DIV
	    }, false)
	  
	    touchsurface.addEventListener('touchend', function(e){
	        var touchobj = e.changedTouches[0]
	        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
	        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
	        elapsedTime = new Date().getTime() - startTime // get time elapsed
	        if (elapsedTime <= allowedTime){ // first condition for awipe met
	            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
	                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
	            }
	            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
	                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
	            }
	        }
	        handleswipe(swipedir)
	        e.preventDefault()
	    }, false)
	}

	sliderClick = function(e){
		target = e.target || e.srcElement;
		parent = e.path[2];

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

		if(direction === "next") {
			next = active.nextElementSibling; 
		}
		else if (direction === "previous") {
			next = active.previousElementSibling;
		}

		if(direction && next){
			if(active.classList.contains("active")){
				active.classList.remove("active");
				if(direction === "next"){
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
				sliderClick(e);
			});
		}
		else {
			slider[i].attachEvent("onclick", function(e){
				sliderClick(e); 
			}); 
		}

		// Add touch events
		swipedetect(slider[i], function(swipedir){
			
			parent = getClosest(eventObj.target, '.portfolio-item__screens');

			if (swipedir == 'right') {
				console.log("right");
				sliderMove("next", parent);
			}
			if (swipedir == 'left') {
				console.log("left");
				sliderMove("previous", parent);
			}
		})

	}


})(document);