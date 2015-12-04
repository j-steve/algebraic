/* global CommutativeOpNode, OperatorNode, ExponentNode, LogarithmNode, ParenthesisNode, DivisionNode */
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
	var $super = MultiplicationNode.$super(this, '&sdot;', 3, 1, sortNodes, multiply);
	
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
	 
	this.simplify = function() {
		$super.simplify();
		for (var i = 1; i <= self.nodes.length; i++) {
			var a = self.nodes[self.nodes.length - i];
			for (var j = self.nodes.length - 1; j >= 0; j--) {
				var b = self.nodes[j];
				if (a !== b) {
					var result = multiply(a, b);
					if (result) {
						self.replace(b, null);
						self.replace(a, result);
						result.simplify();
						a = result;
					}
				}
			}
		}
	};
	
	function multiply(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			a.value *= b.value;
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new ExponentNode(a, 2); 
		} else if (a instanceof ExponentNode && a.leftNode.equals(b)) {
			a.power = new AdditionNode(a.rightNode, 1);
		} else if (a instanceof ExponentNode && b instanceof ExponentNode && a.leftNode.equals(b.leftNode)) {
			a.power = new AdditionNode(a.rightNode, b.rightNode);
		} else if (a instanceof DivisionNode) { 
			a.numerator = new MultiplicationNode(a.numerator, clone(a.denominator)); //TODO- this is dangerous, same node in 2 places
		} else {
			return null;
		}
		return a;
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

