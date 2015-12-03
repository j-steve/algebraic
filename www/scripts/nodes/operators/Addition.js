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
		
		if (self.leftNode instanceof LeafNode && self.rightNode instanceof MultiplicationNode) {
			self.leftNode.replaceWith(self.rightNode);
		}
	};
	
	function add(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			a.value += b.value;
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			a.rotateRight(new MultiplicationNode(2));
			
		} else if (a instanceof MultiplicationNode) {
			if (a.rightNode.equals(b)) { 
				a.leftNode = new AdditionNode(a.leftNode, 1);
			} else if (b instanceof MultiplicationNode && a.rightNode.equals(b.rightNode)) {
				a.leftNode = new AdditionNode(a.leftNode, b.leftNode);
			} else {
				return false;
			}
		} else if (a instanceof DivisionNode && a.rightNode instanceof LeafNode && b instanceof LeafNode) {
			// TODO- this will work even if a.rightNode isn't a leaf node,
			// but need to create a copy of rightnode rather than use its value because it's inserted in 2 places.
			// Also, B doesn't need to be a LeafNode, but it gets removed in CommutativeOpNode so we need to clone it too.
			var bTimesDenominator = new MultiplicationNode(a.rightNode.value, b.value);
			a.leftNode = new AdditionNode(a.leftNode, bTimesDenominator);
		} else {
			return false;
		}
		return true;
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
		$super.simplify();
		
		if (self.rightNode instanceof RealNumberNode) {
			self.rightNode.value *= -1;
			self.replaceWith(new AdditionNode(), true);
		}
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