module.exports = (function(document){

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
			inputStatus = [],
			inputObj = {},
			length = inputs.length,
			i;

		// Define email check
		emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

		// Check if object is empty
		var isEmpty = function(obj) {
			for (var key in obj) {
				if(obj.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		}

		// Push inputs to object and add status parameter only once
		if(isEmpty(inputObj)){
			for(i = 0; i < length; i++){
				inputObj[inputs[i].name] = {elem: inputs[i]};
				inputObj[inputs[i].name]["status"] = false;
			}
		}

		// Define validation function
		validate = function(elem){		
			if(!elem.value || elem.value === elem.getAttribute("placeholder")) {
				// Sort no value validation msg here
				if(elem.parentNode.classList.contains("errorformat")){
					elem.parentNode.classList.remove("errorformat");
				}

				if(!elem.parentNode.classList.contains("error")){
					elem.parentNode.classList.add("error");
				}
				return false;
			}
			if(elem.classList.contains("input--email") && !emailReg.test(elem.value)){
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
		for(input in inputObj){
			if(validate(inputObj[input].elem)){
				inputObj[input].status = true;
			}
			else {
				inputObj[input].status = false;
			}
		}

		// Check if all input status are true otherwise return false
		for(input in inputObj){
			if(!inputObj[input].status) {
				return false;
			}
		}

		return true;
	};

	// Define function which removes error messages on inputs to allow for new data
	(function(document){

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
			formContainer,
			formContainerOverlay,
			inputs,
			name,
			email,
			msg,
			request;

		form = document.querySelector("form");
		formContainer = document.querySelector(".contact-form");
		formContainerOverlay = document.querySelector(".contact-form__overlay span");

		// Define validation inputs
		inputs = document.querySelectorAll("input[type='text'], input[type='email'], textarea");

		// Setup AJAX request
		request = new XMLHttpRequest();

		// Define AJAX response
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if(request.status === 200) {
					if(!formContainer.classList.contains("success")){
						formContainer.classList.add("success");
					}
				}
				else {
					if(!formContainer.classList.contains("failure")){
						formContainer.classList.add("failure");
					}
				}
				if(formContainer.classList.contains("loading")){
					formContainer.classList.remove("loading");
				}
			}
		};

		// Define form submit function
		formSubmit = function(e){
			e.preventDefault();
			if(formReady(inputs)){
				// Grab form data, serialise and send
				if(!formContainer.classList.contains("loading")){
					formContainer.classList.add("loading");
				}
				if(!formContainer.classList.contains("feedback")){
					formContainer.classList.add("feedback");
				}
				request.open("Post", "mailer.php", true);
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.send(serialize(form));
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

})(document);