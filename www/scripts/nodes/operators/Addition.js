/* global OperatorNode, RealNumberNode, LeafNode, SIDES, MultiplicationNode, CommutativeOpNode, DivisionNode, VariableNode */

/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function AdditionNode(_leftNode, _rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2, AdditionNode, add);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
		self.nodes = self.nodes.filter(function(n) {return !n.equals(0);});
	};
	
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