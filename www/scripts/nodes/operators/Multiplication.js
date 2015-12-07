/* global CommutativeOpNode, OperatorNode, ExponentNode, LogarithmNode, ParenthesisNode, DivisionNode */
/* global LeafNode, RealNumberNode, ConstantNode, VariableNode */

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
	var $super = MultiplicationNode.$super(this, '&sdot;', 3, 1, sortNodes, multiply, printSymbol);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() {
		$super.cleanup();
	};
	 
	function sortNodes(a, b) { 
		var OP_SEQ = [RealNumberNode, ConstantNode, ParenthesisNode, ExponentNode, VariableNode];
		var aIndex = OP_SEQ.indexOf(a.constructor), bIndex = OP_SEQ.indexOf(b.constructor);
		if (aIndex > -1 && bIndex > -1) {return aIndex - bIndex;} 
	}
	
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
	
	/** 
	 * @param {BaseNode} nextNode
	 * @returns {string}
	 */
	function printSymbol(nextNode) {
		if (nextNode instanceof VariableNode || nextNode.leftNode instanceof VariableNode) {
			return '<span class="operator coefficient"></span>';
		}
	}
   
}

