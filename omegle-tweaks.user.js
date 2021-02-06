// ==UserScript==
// @name         Omegle-Tweaks
// @version      1.0
// @author       PWall
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
	const dom = document.createElement('script');
	dom.src = 'https://cdn.jsdelivr.net/gh/PWalll/omegle-tweak@0.1/dom.js';
	document.head.appendChild(dom);
	const index = document.createElement('script');
	index.src = 'https://cdn.jsdelivr.net/gh/PWalll/omegle-tweak@0.1/index.js';
	document.head.appendChild(index);
})();