/* global OperatorPrefixNode, RealNumberNode */

Object.extend(OperatorPrefixNode, NegativeNode);
/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} _leftNode 
 */
function NegativeNode(_leftNode) {
	var self = this;
	var $super = NegativeNode.$super(this, '&minus;', 4);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	 
	this.simplify = function() {
		$super.simplify(); 
		if (self.leftNode instanceof NegativeNode) {
			return self.leftNode.leftNode;
		} else if (self.leftNode instanceof RealNumberNode) {
			self.leftNode.value = -self.leftNode.value;
			return self.leftNode;
		}
	};
	
}