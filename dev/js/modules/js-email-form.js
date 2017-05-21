/*
|--------------------------------------------------------------------
|  FORM & SUBMISSION
|--------------------------------------------------------------------
*/

module.exports = (function(document){

	var form = document.querySelector("form"),
		inputs = document.querySelectorAll("input[required], textarea[required]");

	if(form && inputs) {
		var serialize = require("../vendor/serialize.js"),
			button = form.querySelector("button"),
			errorMsg = function(elem) {
				// Grab validation box
				var validationMsg = elem.parentNode.querySelector(".js-input-validation");
				// Add invalid class
				elem.classList.add("is-invalid");
				// Fill validation message
				if(elem.validity.valueMissing) {
					validationMsg.innerHTML = elem.getAttribute("data-required-msg");
				}
				else if(elem.validity.typeMismatch) {
					validationMsg.innerHTML = elem.getAttribute("data-type-mismatch-msg");
				}
			},
			// Setup AJAX request
			request = new XMLHttpRequest(),
			formSubmit = function(){
				var formContent = serialize(form);
				// Add loading state to form
				form.classList.add("is-loading");
				// Make all inputs disabled
				for(var i = 0; i < inputs.length; i++) {
					inputs[i].disabled = true;
					button.disabled = true;
				}
				// Grab form data, serialise and send
				request.open("Post", "scripts/mailer.php", true);
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.send(formContent);
			};


		// If we have required inputs
		if(inputs) {
			for(var i = 0; i < inputs.length; i++) {
				// Add event listener for invalid state
				inputs[i].addEventListener("invalid", function(e){
					e.preventDefault();
					errorMsg(this);
				});
				// Add event listener to check if valid on focus out
				inputs[i].addEventListener("change", function(){
					// On change, check if contents is valid
					// If contents are valid, remove is-invalid class
					if(this.checkValidity()) {
						this.classList.remove("is-invalid");
					}
				});
			}
		}

		// Add event listener for submit if brower supports html5 validation. 
		// We have to manually stop form submit if validation fails because safari won't do it automatically because it sucks.
		form.addEventListener("submit", function(e){
			if(!this.checkValidity()) {
				e.preventDefault();
			}
			else {
				e.preventDefault();
				formSubmit();
			}
		});


		// Define AJAX response
		request.onreadystatechange = function() {
			form.classList.remove("is-loading");
			if (request.readyState === 4) {
				if(request.status === 200) {
					// Add success state
					form.classList.add("is-success");
				}
				else {
					// Add error state
					form.classList.add("is-failure");
				}
			}
		};

	}


})(document);