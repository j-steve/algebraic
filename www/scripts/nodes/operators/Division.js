/* global OperatorNode, LeafNode, MultiplicationNode, RealNumberNode */
/* global ExponentNode, AdditionNode, SubtractionNode, CommutativeOpNode */

Object.extend(OperatorNode, DivisionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function DivisionNode(_leftNode, _rightNode) {
	var self = this; 
	var $super = DivisionNode.$super(this, '∕', 3);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.simplify = function() {
		$super.simplify();
	};
}

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}