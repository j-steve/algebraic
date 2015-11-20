/**
 * The node representation of an operand, i.e., a terminus ("leaf") node 
 * representing a number, variable, or constant rather than a mathmematical operation.
 * 
 * @constructor
 * @property {number|string} value
 * @property {boolean} isNumber
 * 
 * @param {*} value
 */
function LeafNode(value) {
	'use strict';

    // ================================================================================
    // Read-Only Properties
    // ================================================================================

	Object.defineProperty(this, 'value', {
		get: function() {return value;}
	});
	
	this.isNumeric = Number(value) == value; // jshint ignore:line
	
    // ================================================================================
    // Methods
    // ================================================================================

	this.print = function(parentElement) { 
		var newElement = document.createElement('div');
		newElement.className = 'node leaf-node';
		newElement.innerHTML += this.value;
		parentElement.appendChild(newElement);
	};

	this.prettyInput = function() {
		return this.value;
	};

	this.solve = function() {
		return Number(value);
	};

	this.simplify = function() {
		return Number(value);
	};

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
}