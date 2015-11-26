/* global OperatorNode, OperatorPrefixNode, RealNumberNode */

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
		if (self.rightNode.equals(1)) {
			self.replaceWith(self.leftNode);
		} else if (self.rightNode.equals(0)) {
			self.replaceWith(new RealNumberNode(1));
		} else if (instanceOf(self.nodes, RealNumberNode)) {
			var result = Math.pow(self.leftNode.value, self.rightNode.value);
			self.replaceWith(new RealNumberNode(result));
		}
	};
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function RootNode(leftNode, rightNode) {
	var self = this;
	$super = RootNode.$super(this, '&radic;');
	
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	delete leftNode, rightNode; 
	
	this.simplify = function() {
		$super.simplify();
		 /*if (!instanceOf(self.leftNode, RealNumberNode)) {
			var exp = new ExponentNode(self.rightNode, new DivisionNode(1, self.leftNode));
			self.replaceWith(exp);
		}*/
	};
	
}
Object.extend(OperatorNode, RootNode); 

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 * @param {BaseNode} rightNode
 */
function LogarithmNode(base, rightNode) {  
	var self = this;
	var $super = LogarithmNode.$super(this, 'log', 3);
	
	this.leftNode = base || new RealNumberNode(10);
	if (rightNode) {this.rightNode = rightNode;}
	delete base, rightNode; 
	
	this.cleanup = function() {
		$super.cleanup();
		if (!self.rightNode) {self.replaceWith(null);}
	};
	
	this.simplify = function() {
		$super.simplify();
		/*if (instanceOf(self.nodes, RealNumberNode)) {
			var result = Math.log(self.rightNode.value) / Math.log(self.leftNode.value);
			self.replaceWith(new RealNumberNode(result));
		}*/
	};
}
Object.extend(OperatorPrefixNode, LogarithmNode);