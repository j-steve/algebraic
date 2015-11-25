/* global OperatorNode, OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function ExponentNode(leftNode, rightNode) {
	var self = this;
	var $super = ExponentNode.$super(this, '^', 4, true);
	
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	delete leftNode, rightNode;
	
	this.simplify = function() {
		$super.simplify();
		if (instanceOf(self.nodes, RealNumberNode)) {
			var result = Math.pow(self.leftNode.value, self.rightNode.value);
			self.replaceWith(new RealNumberNode(result));
		}
	};
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function RootNode() {
	RootNode.$super(this, '&radic;');
}
Object.extend(OperatorNode, RootNode); 

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 */
function LogarithmNode(base) {  
	LogarithmNode.$super(this, 'log', 3);
	this.leftNode = base || new RealNumberNode(10);
}
Object.extend(OperatorPrefixNode, LogarithmNode);