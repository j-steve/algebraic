/**
 * The node representation of an operand, i.e., a terminus ("leaf") node 
 * representing a number, variable, or constant rather than a mathmematical operation.
 * 
 * @param {*} value
 */
function LeafNode(value) {
	'use strict';

	this._parentNode = null;

    // ================================================================================
    // Read-Only Properties
    // ================================================================================

	Object.defineProperty(this, 'parentNode', {
		get: function() {return this._parentNode;}
	});

	Object.defineProperty(this, 'value', {
		get: function() {return value;}
	});
	
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
	}

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
};