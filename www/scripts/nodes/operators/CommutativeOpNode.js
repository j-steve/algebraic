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
		
		var leafsInScope = self.getNodesInScope().filter(function(x) {return x instanceof LeafNode;});
		var sortedLeafs = leafsInScope.sorted(function(a, b) {return a.displaySequence - b.displaySequence || a.value > b.value;});
		for (var i = 0; i < sortedLeafs.length - 1; i++) {
			var leaf = sortedLeafs[i];
			if (leaf !== leafsInScope[i]) { 
				leaf.replaceWith(leafsInScope[i], false, true);
				leafsInScope[leafsInScope.indexOf(leaf)] = leafsInScope[i];
				leafsInScope[i] = leaf;
			}
		}
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var removedNodes = false;
		var combos = Array.combos(getScopedNodes(self.leftNode), getScopedNodes(self.rightNode));
		combos.forEach(function(combo) { 
			if (!removedNodes) {
				if (operatorFunction(combo[0], combo[1])) {
					if (combos.length > 1) { 
						combo[1].parent.detach();
					} else {
						
					}
				};
			}
		});
		if (removedNodes) {self.simplify();}
	};
	
	function getScopedNodes(startingNode) {
		return startingNode instanceof opInstanceType ? startingNode.getNodesInScope() : [startingNode];
	}
	
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