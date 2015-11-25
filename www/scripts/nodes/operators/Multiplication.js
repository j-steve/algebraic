/* global OperatorNode, LeafNode, RealNumberNode */

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
		var leafsInScope = getLeafsInScope();//.filter(function(x) {return x instanceof RealNumberNode;});
		var sortedLeafs = leafsInScope.sorted(function(a, b) {return a.displaySequence - b.displaySequence || a.value > b.value;});
		for (var i = 0; i < sortedLeafs.length - 1; i++) {
			var leaf = sortedLeafs[i];
			if (leaf !== leafsInScope[i]) {
				leaf.replaceWith(leafsInScope[i]);
				leafsInScope[leafsInScope.indexOf(leaf)] = leafsInScope[i];
				leafsInScope[i] = leaf;
			}
		}
		if (self.leftNode instanceof LeafNode && self.rightNode instanceof BaseMultiplicationNode) {
			self.leftNode.replaceWith(self.rightNode);
		}
	};
	
	this.simplify = function() {
		$super.simplify();
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
			}
		}
		return leafs;
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