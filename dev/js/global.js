"use strict";

/*
|--------------------------------------------------------------------
|  FEATURE ANIMATION
|--------------------------------------------------------------------
*/

// Pass in window and document object to increase lookup speed
(function(window, document){ 

	// Exit prematurely if not on about page as no need to run this module
	if(!document.querySelector("body").classList.contains("about")){
		return false;
	}

	// Check if clip-paths are supported function
	// http://stackoverflow.com/questions/27558996/how-can-i-test-for-clip-path-support
	var areClipPathShapesSupported = function () {var base = 'clipPath', prefixes = [ 'webkit', 'moz', 'ms', 'o' ], properties = [ base ], testElement = document.createElement( 'testelement' ), attribute = 'inset(0 0 0 50%)'; for ( var i = 0, l = prefixes.length; i < l; i++ ) {var prefixedProperty = prefixes[i] + base.charAt( 0 ).toUpperCase() + base.slice( 1 ); properties.push( prefixedProperty ); } for ( var i = 0, l = properties.length; i < l; i++ ) {var property = properties[i]; if ( testElement.style[property] === '' ) {testElement.style[property] = attribute; if ( testElement.style[property] !== '' ) {return true; } } } return false; },

		prefixedEvent = function(element, type, callback) {
			var pfx = ["webkit", "moz", "MS", "o", ""],
				p,
				length = pfx.length;

			for (p = 0; p < length; p++) {
				if (!pfx[p]) type = type.toLowerCase();
				element.addEventListener(pfx[p]+type, callback, false);
			}
		},

		// Set or declare variables
		banner = document.querySelector(".banner--about"),
		full = document.querySelector(".feature-full"),
		lines = document.querySelector(".feature-lines"),
		fullText = document.querySelector(".feature-text--developer"),
		linesText = document.querySelector(".feature-text--designer"),
		pos = document.body.clientWidth / 2 || document.documentElement.clientWidth / 2,
		clipPath = areClipPathShapesSupported(),
		moveWidth = document.body.clientWidth || document.documentElement.clientWidth,
		moveHeight = document.body.clientHeight + 300 || document.documentElement.clientHeight + 300,
		bannerEnter,
		bannerLeave,
		bannerAnimation,
		bannerLoad,
		resizeBanner,
		bannerToDefault,
		bannerReset,
		anim0,	anim10, anim50, anim60, anim100,

	// Create function to set default feature state
	resizeBanner = function(){
		// Reinitialise with current document width and height
		moveWidth = document.body.clientWidth || document.documentElement.clientWidth;
		moveHeight = document.body.clientHeight + 300 || document.documentElement.clientHeight + 300; 

		// Reset vertical line
		if(!clipPath){
			full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;
		}
	};

	// Define function which fires when About banner has loaded so legacy intro animation can begin
	bannerLoad = function(){
		anim0 = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth}px)`;
		anim10 = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth}px)`;
		anim50 = `rect(0px, ${moveWidth}px, ${moveHeight}px, 0px)`;
		anim60 = `rect(0px, ${moveWidth}px, ${moveHeight}px, 0px)`;
		anim100 = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;

		// dynamically add new @keyframes into head for legacy animation
		var style = document.createElement('style');
		style.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(style);
		style.innerHTML = `
			@-webkit-keyframes banner-animate-legacy {
				0%	{
					clip: ${anim0}
				}
				5% {
					clip: ${anim10}
				}
				50% {
					clip: ${anim50}
				}
				55% {
					clip: ${anim60}
				}
				100% {
					clip: ${anim100}
				}
			}
			@keyframes banner-animate-legacy {
				0%	{
					clip: ${anim0}
				}
				5% {
					clip: ${anim10}
				}
				50% {
					clip: ${anim50}
				}
				55% {
					clip: ${anim60}
				}
				100% {
					clip: ${anim100}
				}
			}
		`
	};

	bannerReset = function(){
		if(!clipPath){
			full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${moveWidth*0.50}px)`;
		}
		else {
			full.style.setProperty("-webkit-clip-path", "inset(0 0 0 50%)");
		}	
	};

	bannerToDefault = function(){
		if(!clipPath){
			document.querySelector("body").classList.add("no-clip-path");
			// if browser supports CSS animations then run load animation else clear animation blocking class
			if(Modernizr.cssanimations) {
				bannerLoad();
			}
			else {
				bannerAnimation();
			}
			bannerReset(); 
		}
		else {
			document.querySelector("body").classList.add("clip-path");
			full.style.setProperty("-webkit-clip-path", "inset(0 0 0 50%)");
		}
	};
	
	// On window resize get new document dimensions and recrop if not clip-path
	window.onresize = function(){ 
		resizeBanner();  
	}

	// Define function which fires when mouse enters feature
	bannerEnter = function(){

		// If no touch events and if higher then the med breakpoint then enable interaction
		if(bp.min("med") && !banner.classList.contains("animated")){

			if(banner.classList.contains("inactive")) {
				banner.classList.remove("inactive");
			}

			// Define what happens as mouse moves
			banner.onmousemove = function(e){
				e = e || window.event;
				pos = e.pageX || e.clientX
				pos = moveWidth - pos;

				//Move vertical line
				if(clipPath){ 
					full.style.setProperty("-webkit-clip-path", `inset(0 0 0 ${pos}px)`); 
				}
				else {
					full.style.clip = `rect(0px, ${moveWidth}px, ${moveHeight}px, ${pos}px)`;
				}
			};
		}
	};

	// Define function which fires when mouse leaves feature
	bannerLeave = function(){
		if(bp.min("med") && !banner.classList.contains("animated")){
			if(!banner.classList.contains("inactive")) {
				banner.classList.add("inactive");
			}
			bannerReset();
		}
	};

	// Define function which fires when CSS animation intro has ended
	bannerAnimation = function(){
		if(banner.classList.contains("animated")) { 
			banner.classList.remove("animated");
		}
	};

	// Attach event liseners if not touch device and if not available use legacy attachEvent
	if(!Modernizr.touchevents){
		if(banner.addEventListener){
			prefixedEvent(full, "AnimationEnd", bannerAnimation);
			banner.addEventListener("mouseover", bannerEnter);
			banner.addEventListener("mouseleave", bannerLeave);
		}
		else {
			banner.attachEvent("onmouseenter", bannerEnter);
			banner.attachEvent("onmouseleave", bannerLeave); 
		}
	}

	// Run once to initialise feature
	bannerToDefault();

})(window, document);


/*
|--------------------------------------------------------------------
| GENERATE CURRENT YEAR
|--------------------------------------------------------------------
*/

(function(document) {
	var year = document.querySelector(".year");
	year.textContent = (new Date).getFullYear();
})(document);


/*
|--------------------------------------------------------------------
|  FORM VALIDATION
|--------------------------------------------------------------------
*/

// Define function which returns either true or false
var formReady = function(inputs){ 

	var formStatus = false,
		emailReg,
		validate,
		btn,
		i,
		length = inputs.length;

	// Define email check
	emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

	// Define validation function
	validate = function(elem){		
		if(!elem.value) {
			// Sort no value validation msg here
			return false;
		}
		if(elem.type === "email" && !emailReg.test(elem.value)){
			// Sort incorrect email format validation msg here
			return false;		 		
		}
		else {
			return true;
		}
	}

	for(i = 0; i < length; i++){
		if(validate(inputs[i])) {
			console.log(inputs[i].placeholder + " passed");
			formStatus = true;
		}
		else {
			console.log(inputs[i].placeholder + " failed");
			formStatus = false;
		}
	}

	// FIX HERE
	if(formStatus){
		return true;
	}
	else {
		return false;
	}
};


/*
|--------------------------------------------------------------------
|  FORM SUBMISSION
|--------------------------------------------------------------------
*/

(function(window, document, formReady){ 

	// Exit prematurely if not on about page as no need to run this module
	if(!document.querySelector("body").classList.contains("contact")){
		return false;
	}

	var form,
		formSubmit,
		formInputs,
		name,
		email,
		msg;

	form = document.querySelector("form");

	name = document.querySelector("input[name='name']");
	email = document.querySelector("input[type='email']");
	msg = document.querySelector("textarea[name='message']");

	formInputs = [name, email, msg];

	// Define form submit function
	formSubmit = function(e){
		e.preventDefault();
		if(formReady(formInputs)){
			// Ajax fun
			console.log("Form passed validation");
		}
		else {
			console.log("Form failed");
		}
		return false;
	};

	// Attach event handlers
	if(form.addEventListener){
		form.addEventListener("submit", function(e){
			formSubmit(e);
		});
	}
	else {
		form.attachEvent("onsubmit", function(e){
			formSubmit(e);
		});
	}

})(window, document, formReady);


