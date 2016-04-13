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
		input,
		inputStatus = [];

	// Define email check
	emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

	// Define validation function
	validate = function(elem){		
		if(!elem.value) {
			// Sort no value validation msg here
			if(elem.parentNode.classList.contains("errorformat")){
				elem.parentNode.classList.remove("errorformat");
			}

			if(!elem.parentNode.classList.contains("error")){
				elem.parentNode.classList.add("error");
			}
			return false;
		}
		if(elem.type === "email" && !emailReg.test(elem.value)){
			// Sort incorrect email format validation msg here
			if(!elem.parentNode.classList.contains("error")){
				elem.parentNode.classList.add("error");
			}
			if(!elem.parentNode.classList.contains("errorformat")){
				elem.parentNode.classList.add("errorformat");
			}
			return false;		 		
		}
		else {
			if(elem.parentNode.classList.contains("error")){
				elem.parentNode.classList.remove("error");
			}

			return true;
		}
	}

	// Validate all inputs within input object and update each status
	for(input in inputs){
		if(validate(inputs[input].elem)){
			inputs[input].status = true;
		}
		else {
			inputs[input].status = false;
		}
	}

	// Check if all input status are true otherwise return false
	for(input in inputs){
		if(!inputs[input].status) {
			return false;
		}
	}

	return true;
};

// Define function which removes error messages on inputs to allow for new data
(function(){

	// Exit prematurely if not on contact page as no need to run this module
	if(!document.querySelector("body").classList.contains("contact")){
		return false;
	}

	var inputs,
		i,
		length,
		inputReset,
		elem;

	inputs = document.querySelectorAll(".input-container");
	length = inputs.length;

	inputReset = function(e){
		if(e.type === "focus"){
			elem = e.target.parentNode;
		}
		else {
			elem = e.target;
		}

		if(elem.classList.contains("error")){
			elem.classList.remove("error");
		}
	}

	for(i = 0; i < length; i++){
		if(inputs[i].addEventListener){
			if(!Modernizr.touchevents) {
				inputs[i].addEventListener("mouseenter", function(e){
					inputReset(e);
				});
			}
			else {
				inputs[i].addEventListener("click", function(e){
					inputReset(e);
				});
			}
			inputs[i].firstChild.addEventListener("focus", function(e){
				inputReset(e);
			});
		}
		else {
			inputs[i].attachEvent("onmouseenter", function(e){
				inputReset(e);
			});
			inputs[i].attachEvent("onfocus", function(e){
				inputReset(e);
			});
		}
	}

})(document);


/*
|--------------------------------------------------------------------
|  FORM SUBMISSION
|--------------------------------------------------------------------
*/

(function(document, formReady){ 

	// Exit prematurely if not on contact page as no need to run this module
	if(!document.querySelector("body").classList.contains("contact")){
		return false;
	}

	var form,
		formSubmit,
		inputs,
		name,
		email,
		msg,
		i,
		length,
		inputObj = {};

	form = document.querySelector("form");

	// Define validation inputs
	inputs = document.querySelectorAll("input[type='text'], input[type='email'], textarea");
	length = inputs.length;

	// Push input to object and add status parameter
	for(i = 0; i < length; i++){
		inputObj[inputs[i].name] = {elem: inputs[i]};
		inputObj[inputs[i].name]["status"] = false;
	}

	// Define form submit function
	formSubmit = function(e){
		e.preventDefault();
		if(formReady(inputObj)){
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

})(document, formReady);


