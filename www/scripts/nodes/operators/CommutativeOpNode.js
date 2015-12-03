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
	
	
	this.finalize = function() {
		self.nodes = getNodesInScope();
		self.nodes.forEach(function(node) {node.parent = self;});
		$super.finalize();
	};
	
	function getNodesInScope() {
		var results = [];
		var nodeStack = self.nodes.slice();
		while (nodeStack.length) {
			var node = nodeStack.shift();
			if (node instanceof opInstanceType) {
				nodeStack = node.nodes.concat(nodeStack);
			} else {
				results.push(node);
			}
		}
		return results;
	}
	
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