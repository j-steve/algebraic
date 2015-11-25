/* global BaseNode */

/**
 * The node representation of an operand, i.e., a terminus ("leaf") node 
 * representing a number, variable, or constant rather than a mathmematical operation.
 * 
 * @constructor
 * @extends {BaseNode}
 * @property {number|string} value
 * @property {number} displaySequence
 * 
 * @param {number|string} value
 * @param {number} displaySequence
 */
function LeafNode(value, displaySequence) {
	var self = this;
	var $super = LeafNode.$super(this);

	this.value = value; 
	this.displaySequence = displaySequence;
	
	this.toString = function() {
		return self.value;
	};
	
	this.equals = function(other) {
		return $super.equals(other) && self.value === other.value;
	};
}
Object.extend(BaseNode, LeafNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string|number} value   a string or string representation of a number
 */
function RealNumberNode(value) { 
	value = Number(value);
	RealNumberNode.$super(this, value, 1);
}
Object.extend(LeafNode, RealNumberNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string} value   a letter representing the name of a variable
 */
function VariableNode(value) {
	VariableNode.$super(this, value, 3);
}
Object.extend(LeafNode, VariableNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string|number} value   an HTML-formatted display text for a constant
 */
function ConstantNode(value) {
	ConstantNode.$super(this, value, 2);
}
Object.extend(LeafNode, ConstantNode);

ConstantNode.E = function() {return new ConstantNode('<i>e</i>');};
ConstantNode.I = function() {return new ConstantNode('<i>i</i>');};
ConstantNode.PI = function() {return new ConstantNode('&pi;');};