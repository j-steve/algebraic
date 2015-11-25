/* global OperatorNode, RealNumberNode */

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function AdditionNode(leftNode, rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2);
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	
	
	this.simplify = function() {
		$super.simplify();
		
		if (self.leftNode instanceof RealNumberNode && self.rightNode instanceof RealNumberNode) {
			self.replaceWith(new RealNumberNode(self.leftNode.value + self.rightNode.value));
		}
	};
}
Object.extend(OperatorNode, AdditionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function SubtractionNode() {
	SubtractionNode.$super(this, '&minus;', 2);
}
Object.extend(OperatorNode, SubtractionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	PlusOrMinusNode.$super(this, '&plusmn;', 2);
}
Object.extend(OperatorNode, PlusOrMinusNode);