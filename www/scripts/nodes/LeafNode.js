/* global BaseNode */

/**
 * The node representation of an operand, i.e., a terminus ("leaf") node 
 * representing a number, variable, or constant rather than a mathmematical operation.
 * 
 * @constructor
 * @extends {BaseNode}
 * @property {number|string} value
 * @property {boolean} isNumber
 * 
 * @param {*} value
 */
function LeafNode(value) {
	BaseNode.call(this);

	this.value = value; 
	this.printVals.middle = value;
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
	LeafNode.call(this, value);
}
Object.extend(LeafNode, RealNumberNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string} value   a letter representing the name of a variable
 */
function VariableNode(value) {
	LeafNode.call(this, value);
}
Object.extend(LeafNode, VariableNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string|number} value   an HTML-formatted display text for a constant
 */
function ConstantNode(value) {
	LeafNode.call(this, value);
}
Object.extend(LeafNode, ConstantNode);

ConstantNode.E = function() {return new ConstantNode('<i>e</i');};
ConstantNode.I = function() {return new ConstantNode('<i>e</i');};
ConstantNode.PI = function() {return new ConstantNode('&pi;');};