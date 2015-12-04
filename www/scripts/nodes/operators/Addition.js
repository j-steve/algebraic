/* global OperatorNode, RealNumberNode, LeafNode, MultiplicationNode, CommutativeOpNode, DivisionNode, VariableNode */
/* global LogarithmNode, NthRootNode, ExponentNode, ConstantNode */

var ADDITION_SEQUENCE = [
	NthRootNode, LogarithmNode, ExponentNode, MultiplicationNode, 
	DivisionNode, RealNumberNode, VariableNode, ConstantNode
];

/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function AdditionNode(_leftNode, _rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2, add, true);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
		self.nodes = self.nodes.filter(function(n) {return !n.equals(0);}); 
		self.nodes.sort(sortNodes);
	};
	
	function sortNodes(a, b) {
		if (a instanceof MultiplicationNode && a.rightNode instanceof ExponentNode) {a = a.rightNode;}
		if (b instanceof MultiplicationNode && b.rightNode instanceof ExponentNode) {b = b.rightNode;}

		if (a.constructor !== b.constructor) {
			return ADDITION_SEQUENCE.indexOf(b.constructor) - ADDITION_SEQUENCE.indexOf(a.constructor);
		} else if (a instanceof ExponentNode && instanceOf([a.power, b.power], RealNumberNode)) {
			return b.power.value - a.power.value;
		} else if (a instanceof RealNumberNode) {
			return b.value - a.value;
		} else if (a instanceof VariableNode) {
			return a.value > b.value ? 1 : a.value === b.value ? 0 : -1;
		}
	}
	
	function add(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value + b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new MultiplicationNode(2, a);
			
		} else if (a instanceof MultiplicationNode && a.rightNode instanceof VariableNode) {
			if (a.rightNode.equals(b)) {
				var newAdd = new AdditionNode(a.leftNode, 1);
				return new MultiplicationNode(newAdd, a.rightNode); 
			} else if (a.rightNode.equals(b.rightNode)) { 
				var newAdd = new AdditionNode(a.leftNode, b.leftNode); //jshint ignore:line
				return new MultiplicationNode(newAdd, a.rightNode);
			}
		} else if (b instanceof DivisionNode && b.rightNode instanceof LeafNode) {
			// TODO- this will work even if b.rightNode isn't a leaf node,
			// but need to create a copy of rightnode rather than use its value because it's inserted in 2 places.
			var newAdd = new AdditionNode(b.leftNode, new MultiplicationNode(a, b.rightNode.value));  //jshint ignore:line
			return new DivisionNode(newAdd, b.rightNode.value);
		}
	}
}
Object.extend(CommutativeOpNode, AdditionNode);


Object.extend(OperatorNode, SubtractionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function SubtractionNode(_leftNode, _rightNode) {
	var self = this;
	var $super = SubtractionNode.$super(this, '&minus;', 2);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
	};
}


Object.extend(OperatorNode, PlusOrMinusNode);
/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	PlusOrMinusNode.$super(this, '&plusmn;', 2);
}