/* global OperatorNode, LeafNode, RealNumberNode, ExponentNode, SIDES */

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} debugSymbol 
 * @param {number} stickiness
 */
function BaseMultiplicationNode(debugSymbol, stickiness) {
	var self = this;
	var $super = BaseMultiplicationNode.$super(this, debugSymbol, stickiness);
	
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
		/*if (self.leftNode instanceof LeafNode && self.rightNode instanceof BaseMultiplicationNode) {
			self.leftNode.replaceWith(self.rightNode);
		}*/
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var leafsInScope = getLeafsInScope();
		//var checkNodes = self.nodes.slice(); 
		 
		nodes: for (var i = 0; i < SIDES.length; i++) { 
			var side = SIDES[i];
			var node = self[side];
			for (var j = 0; j < leafsInScope.length; j++) {
				var otherNode = leafsInScope[j];
				if (otherNode !== node) { 
					var multiplyResult = multiply(node, otherNode);
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
		
		/*
		for (var i = 0; i < leafsInScope.length - 1; i++) {
			var leaf1 = leafsInScope[i];
			for (var j = i + 1; i < leafsInScope.length; i++) {
				var leaf2 = leafsInScope[j];
				var multiplyResult = multiply(leaf1, leaf2);
				if (multiplyResult) {
					
				}
			}
		}
		var scopeCombos = Array.combos(getLeafsInScope());
		if (self.leftNode instanceof RealNumberNode && self.rightNode instanceof RealNumberNode) {
			self.replaceWith(new RealNumberNode(self.leftNode.value * self.rightNode.value));
		
		} else if (self.rightNode instanceof LeafNode && self.parent.rightNode instanceof LeafNode &&
				self.rightNode.value === self.parent.rightNode.value) {
			self.parent.replaceWith(self);
			var exponent = new ExponentNode();
			exponent.leftNode = self.rightNode;
			exponent.rightNode = new RealNumberNode(2);
			self.rightNode = exponent;
		}
		*/
	};
	
	function getLeafsInScope() {
		var leafs = [];
		var stack = self.nodes.slice();
		while (stack.length) {
			var node = stack.shift();
			if (node instanceof LeafNode) {
				leafs.push(node);
			} else if (node instanceof BaseMultiplicationNode) {
				stack = node.nodes.concat(stack);
			} else {
				leafs.push(node);
			}
		}
		return leafs;
	}
	
	function multiply(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value * b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new ExponentNode(a, 2);
			
		} else if (a instanceof ExponentNode && a.leftNode.equals(b)) {
			var rightNode = new AdditionNode(a.rightNode, 1);
			return new ExponentNode(a.leftNode, rightNode);
			
		} else if (b instanceof ExponentNode && b.leftNode.equals(a)) {
			var rightNode = new AdditionNode(b.rightNode, 1);
			return new ExponentNode(b.leftNode, rightNode);
		
		} else if (a instanceof ExponentNode && b instanceof ExponentNode && a.leftNode.equals(b.leftNode)) {
			var rightNode = new AdditionNode(a.rightNode, b.rightNode);
			return new ExponentNode(a.leftNode, rightNode);
		}
	}
}
Object.extend(OperatorNode, BaseMultiplicationNode);

/**
 * @constructor
 * @extends {BaseMultiplicationNode}
 */
function MultiplicationNode() {
	var self = this; 
	var $super = MultiplicationNode.$super(this, '&sdot;', 3);
	 
	this.cleanup = function() {
		$super.cleanup();
		if (self.hasBothLeafs()) {
			self.replaceWith(new CoefficientNode, true);
		}
	};
}
Object.extend(BaseMultiplicationNode, MultiplicationNode);

/**
 * @constructor
 * @extends {BaseMultiplicationNode}
 */
function CoefficientNode() {
	var $super = CoefficientNode.$super(this, '<span style="color:gray;">&sdot;</span>', 4);
}
Object.extend(BaseMultiplicationNode, CoefficientNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function DivisionNode() {
	var self = this; 
	var $super = DivisionNode.$super(this, '∕', 3);
	
	this.simplify = function() {
		$super.simplify(); 
		if (self.hasBothLeafs()) {
			var gcd = commonDenominator(self.leftNode.value, self.rightNode.value);
			if (gcd) {
				self.leftNode.value = self.leftNode.value / gcd;
				self.rightNode.value = self.rightNode.value / gcd;
			}
			if (self.rightNode.value === 1) {
				self.replaceWith(self.leftNode);
			}
		}
		/*if (self.rightNode instanceof RealNumberNode && self.leftNode.value !== 1) {
			var oneOver = new DivisionNode;
			oneOver.leftNode = new RealNumberNode(1);
			oneOver.rightNode = self.rightNode;
			self.rightNode = oneOver;
			self.replaceWith(new MultiplicationNode, true);
		}*/
	};
}
Object.extend(OperatorNode, DivisionNode);

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}