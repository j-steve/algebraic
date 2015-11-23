/* global BaseNode */

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
	
	BaseNode.call(this);

	this.value = value;
	
	this.printVals.middle = value;
}
Object.extend(BaseNode, LeafNode);


function RealNumberNode(value) { 
	value = Number(value);
	
	LeafNode.call(this, value);
}
Object.extend(LeafNode, RealNumberNode);


function VariableNode(value) { 
	
	LeafNode.call(this, value);
}
Object.extend(LeafNode, VariableNode);

function ConstantNode(value) { 
	
	LeafNode.call(this, value);
}
Object.extend(LeafNode, ConstantNode);