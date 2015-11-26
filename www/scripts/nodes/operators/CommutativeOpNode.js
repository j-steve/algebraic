/* global OperatorNode, LeafNode, SIDES */


Object.extend(OperatorNode, CommutativeOpNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} debugSymbol
 * @param {number} stickinesss
 * @param {Function} opInstanceType
 * @param {Function} operatorFunction
 */
function CommutativeOpNode(debugSymbol, stickinesss, opInstanceType, operatorFunction) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, debugSymbol, stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
		
		var leafsInScope = self.getLeafsInScope().filter(function(x) {return x instanceof LeafNode;});
		var sortedLeafs = leafsInScope.sorted(function(a, b) {return a.displaySequence - b.displaySequence || a.value > b.value;});
		for (var i = 0; i < sortedLeafs.length - 1; i++) {
			var leaf = sortedLeafs[i];
			if (leaf !== leafsInScope[i]) { 
				leaf.replaceWith(leafsInScope[i]);
				leafsInScope[leafsInScope.indexOf(leaf)] = leafsInScope[i];
				leafsInScope[i] = leaf;
			}
		}
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var leafsInScope = self.getLeafsInScope();
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
	
	this.getLeafsInScope = function() {
		var leafs = [];
		var stack = self.nodes.slice();
		while (stack.length) {
			var node = stack.shift();
			if (node instanceof LeafNode) {
				leafs.push(node);
			} else if (node instanceof opInstanceType) {
				stack = node.nodes.concat(stack);
			} else {
				leafs.push(node);
			}
		}
		return leafs;
	};
}