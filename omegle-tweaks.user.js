// ==UserScript==
// @name         Omegle
// @version      1.0
// @author       PWall
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
	const dom = document.createElement('script');
	dom.src = 'https://raw.githubusercontent.com/PWalll/omegle-tweak/master/dom.js';
	document.head.appendChild(dom);
	const index = document.createElement('script');
	index.src = 'https://raw.githubusercontent.com/PWalll/omegle-tweak/master/index.js';
	document.head.appendChild(index);
})();