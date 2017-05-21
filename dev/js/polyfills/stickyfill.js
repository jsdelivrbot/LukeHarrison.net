if(!Modernizr.csspositionsticky) {
	var Stickyfill = require('stickyfill'),
	stickyfill = Stickyfill(),
	polyElem = document.querySelector(".js-sticky-polyfill");
	stickyfill.add(polyElem);
}