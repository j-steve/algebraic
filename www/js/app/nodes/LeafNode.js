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
	
	var self = this;

    // ================================================================================
    // Public Properties
    // ================================================================================

	this.value = value;
	
    // ================================================================================
    // Methods
    // ================================================================================
	
	this.isNumeric = function() {
		return String(Number(this.value)) === this.value;
	};
	

	this.print = function(parentElement) { 
		var newElement = document.createElement('div');
		newElement.className = 'node leaf-node';
		newElement.innerHTML += self.value;
		parentElement.appendChild(newElement);
	};

	this.prettyInput = function() {
		return self.value;
	};

	this.simplify = function() {
		return Number(self.value);
	};

	this.calculate = function() {
		return self.isNumeric() ? Number(self.value) : self.value;
	};

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
}