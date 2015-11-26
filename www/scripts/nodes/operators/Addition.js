/* global OperatorNode, RealNumberNode, LeafNode, SIDES, MultiplicationNode, CommutativeOpNode, DivisionNode */

/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function AdditionNode(leftNode, rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2, AdditionNode, add);
	
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	delete leftNode, rightNode;
	
	this.cleanup = function() { 
		$super.cleanup();
		
		if (self.leftNode instanceof LeafNode && self.rightNode instanceof MultiplicationNode) {
			self.leftNode.replaceWith(self.rightNode);
		}
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
				var newAdd = new AdditionNode(a.leftNode, b.leftNode);
				return new MultiplicationNode(newAdd, a.rightNode);
			}
		} else if (b instanceof DivisionNode) {
			var newAdd = new AdditionNode(b.leftNode, a);
			return new DivisionNode(newAdd, b.rightNode);
		}
	}
}
Object.extend(CommutativeOpNode, AdditionNode);


Object.extend(OperatorNode, SubtractionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function SubtractionNode(leftNode, rightNode) {
	var self = this;
	var $super = SubtractionNode.$super(this, '&minus;', 2);
	
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	delete leftNode, rightNode;
	
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