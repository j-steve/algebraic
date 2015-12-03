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
	
	this.finalize = function() {
		self.nodes = self.getNodesInScope();
		$super.finalize();
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var leafsInScope = self.getNodesInScope();
		//var checkNodes = self.nodes.slice();
		 
		nodes: for (var i = 0; i < SIDES.length; i++) { 
			var side = SIDES[i];
			var node = self[side];
			for (var j = 0; j < leafsInScope.length; j++) {
				var otherNode = leafsInScope[j];
				if (otherNode !== node) { 
					var opResult = operatorFunction.call(null, node, otherNode);
					if (opResult) {
						opResult.simplify();
						if (otherNode.parent === self) {
							self.replaceWith(opResult);
							return;
						}
						self[side] = opResult;
						var otherNodeSister = otherNode.parent.nodes.find(function(x) {return x !== otherNode;});
						otherNode.parent.replaceWith(otherNodeSister);
						leafsInScope.remove(node, otherNode);
						leafsInScope.push(opResult);
						i--;
						continue nodes;
					}
				}
			}
		}
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