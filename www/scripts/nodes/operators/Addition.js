/* global OperatorNode, RealNumberNode, LeafNode, SIDES, MultiplicationNode */

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
	
	
	this.cleanup = function() { 
		$super.cleanup();
		
		var leafsInScope = getLeafsInScope().filter(function(x) {return x instanceof LeafNode;});
		var sortedLeafs = leafsInScope.sorted(function(a, b) {return a.displaySequence - b.displaySequence || a.value > b.value;});
		for (var i = 0; i < sortedLeafs.length - 1; i++) {
			var leaf = sortedLeafs[i];
			if (leaf !== leafsInScope[i]) { 
				leaf.replaceWith(leafsInScope[i]);
				leafsInScope[leafsInScope.indexOf(leaf)] = leafsInScope[i];
				leafsInScope[i] = leaf;
			}
		}
		/*if (self.leftNode instanceof LeafNode && self.rightNode instanceof MultiplicationNode) {
			self.leftNode.replaceWith(self.rightNode);
		}*/
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var leafsInScope = getLeafsInScope();
		 
		nodes: for (var i = 0; i < SIDES.length; i++) { 
			var side = SIDES[i];
			var node = self[side];
			for (var j = 0; j < leafsInScope.length; j++) { 
				var otherNode = leafsInScope[j];
				if (otherNode !== node) { 
					var multiplyResult = add(node, otherNode);
					if (multiplyResult) {
						multiplyResult.simplify();
						if (otherNode.parent === self) {
							self.replaceWith(multiplyResult);
							return;
						}
						self[side] = multiplyResult;
						var otherNodeSister = otherNode.parent.nodes.find(function(x) {return x !== otherNode;});
						otherNode.parent.replaceWith(otherNodeSister);
						leafsInScope.remove(node, otherNode);
						leafsInScope.push(multiplyResult);
						i--;
						continue nodes;
					}
				}
			}
		}
	};
	
	function getLeafsInScope() {
		var leafs = [];
		var stack = self.nodes.slice();
		while (stack.length) {
			var node = stack.shift();
			if (node instanceof LeafNode) {
				leafs.push(node);
			} else if (node instanceof AdditionNode) {
				stack = node.nodes.concat(stack);
			} else {
				leafs.push(node);
			}
		}
		return leafs;
	}
	
	function add(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value + b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			//return new MultiplicationNode(2, a);  TODO
			
		} else if (a instanceof LeafNode && b instanceof MultiplicationNode && b.leftNode.equals(a)) {
			var newAdd = new AdditionNode(b.rightNode, a);
			return new MultiplicationNode(b.leftNode, newAdd);
		} else if (a instanceof LeafNode && b instanceof MultiplicationNode && b.rightNode.equals(a)) {
			var newAdd = new AdditionNode(b.leftNode, a);
			return new MultiplicationNode(newAdd, b.rightNode);
		}
		
		 else if (a instanceof MultiplicationNode && b instanceof MultiplicationNode && a.leftNode.equals(b.leftNode)) {
			var newAdd = new AdditionNode(a.rightNode, b.rightNode);
			return new MultiplicationNode(a.leftNode, newAdd);
		}
		 else if (a instanceof MultiplicationNode && b instanceof MultiplicationNode && a.rightNode.equals(b.rightNode)) {
			var newAdd = new AdditionNode(a.leftNode, b.leftNode);
			return new MultiplicationNode(newAdd, a.rightNode);
		}
	}
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