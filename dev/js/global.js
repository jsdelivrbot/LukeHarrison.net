/*
|--------------------------------------------------------------------
|  PROJECT CODE
|--------------------------------------------------------------------
*/

// Bind querySelector for jQuery-esq selection method
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

if(bp.min("med")){
	console.log("hello");
}