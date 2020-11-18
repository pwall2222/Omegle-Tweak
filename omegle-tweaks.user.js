// ==UserScript==
// @name         Omegle-Tweaks
// @version      1.0
// @author       PWall
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
	const dom = document.createElement('script');
	dom.src = 'https://cdn.jsdelivr.net/gh/PWalll/omegle-tweak@master/dom.js';
	document.head.appendChild(dom);
	const index = document.createElement('script');
	index.src = 'https://cdn.jsdelivr.net/gh/PWalll/omegle-tweak@master/index.js';
	document.head.appendChild(index);
})();