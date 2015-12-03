/* global OperatorNode, LeafNode, SIDES */


Object.extend(OperatorNode, CommutativeOpNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} _debugSymbol
 * @param {number} _stickinesss
 * @param {Function} opInstanceType
 * @param {Function} operatorFunction
 */
function CommutativeOpNode(_debugSymbol, _stickinesss, opInstanceType, operatorFunction) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, _debugSymbol, _stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
		self.nodes.sort(function(a, b) {
			return a.displaySequence - b.displaySequence || a.value > b.value;
		});
	};
	
	this.simplify = function() {
		$super.simplify();
	};
	
	this.getNodesInScope = function() {
		var endNodes = [];
		var stack = self.nodes.slice();
		while (stack.length) {
			var node = stack.shift();
			if (node instanceof opInstanceType) {
				stack = node.nodes.concat(stack);
			} else {
				endNodes.push(node);
			}
		}
		return endNodes;
	};
}