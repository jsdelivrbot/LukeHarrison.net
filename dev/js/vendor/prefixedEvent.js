var prefixedEvent = function(element, type, callback) {
	var pfx = ["webkit", "moz", "MS", "o", ""],
		p,
		length = pfx.length;

	for (p = 0; p < length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
};

module.exports = prefixedEvent;