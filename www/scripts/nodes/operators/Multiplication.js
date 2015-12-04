/* global CommutativeOpNode, OperatorNode, ExponentNode, LogarithmNode, ParenthesisNode */
/* global LeafNode, RealNumberNode, ConstantNode, VariableNode */

var MULTIPLICATION_SEQUENCE = [
	RealNumberNode, ConstantNode, ExponentNode, VariableNode
];

Object.extend(CommutativeOpNode, MultiplicationNode);
/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function MultiplicationNode(_leftNode, _rightNode) {
	var self = this;
	var $super = MultiplicationNode.$super(this, '&sdot;', 3, 1, sortNodes);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() {
		$super.cleanup();
	};
	 
	function sortNodes(a, b) { 
		var OP_SEQ = [RealNumberNode, ConstantNode, ParenthesisNode, VariableNode];
		var aIndex = OP_SEQ.indexOf(a.constructor), bIndex = OP_SEQ.indexOf(b.constructor);
		if (aIndex > -1 && bIndex > -1) {return aIndex - bIndex;} 
	}
	
	function multiply(a, b) { 
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value * b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new ExponentNode(a, 2);
			
		} else if (a instanceof ExponentNode && a.leftNode.equals(b)) {
			var rightNode = new AdditionNode(a.rightNode, 1);
			return new ExponentNode(a.leftNode, rightNode);
			
		} else if (b instanceof ExponentNode && b.leftNode.equals(a)) {
			var rightNode = new AdditionNode(b.rightNode, 1); //jshint ignore:line
			return new ExponentNode(b.leftNode, rightNode);
		
		} else if (a instanceof ExponentNode && b instanceof ExponentNode && a.leftNode.equals(b.leftNode)) {
			var rightNode = new AdditionNode(a.rightNode, b.rightNode);  //jshint ignore:line
			return new ExponentNode(a.leftNode, rightNode);
			
		} else if (b instanceof DivisionNode) {
			var newMultiply = new MultiplicationNode(b.leftNode, a);
			return new DivisionNode(newMultiply, b.rightNode);
		}
	}
	/*
	this.isCoefficient = function() {
		for (var i = 0; i < SIDES.length; i++) { 
			var node = self[SIDES[i]];
			if (!(node instanceof LeafNode || node instanceof ExponentNode && node.leftNode instanceof LeafNode ||
					node instanceof MultiplicationNode && node.isCoefficient())) {
				return false;
			}
		}
		return true;
	};
	
	this.toString = function() {
		if (self.isCoefficient()) {
			self.printVals.before = self.printVals.before.replace('node', 'node coefficient');
		} 
		return $super.toString();
	}; 
	*/
}

