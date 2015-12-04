/* global OperatorNode, LeafNode, MultiplicationNode, RealNumberNode */
/* global ExponentNode, AdditionNode, SubtractionNode, CommutativeOpNode */

Object.extend(OperatorNode, DivisionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * @property {BaseNode} numerator   synonym for leftNode
 * @property {BaseNode} denominator   synonym for rightNode
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function DivisionNode(_leftNode, _rightNode) {
	var self = this; 
	var $super = DivisionNode.$super(this, '∕', 3);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	Object.defineProperty(self, 'numerator', {
		get: function() {return self.leftNode;},
		set: function(value) {self.leftNode = value;}
	});
	 
	Object.defineProperty(self, 'denominator', {
		get: function() {return self.rightNode;},
		set: function(value) {self.rightNode = value;}
	});
	
	this.cleanup = function() {
		$super.cleanup();
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var numerator = getScopedNodes(self.leftNode);
		var denominator = getScopedNodes(self.rightNode);
		
		if (instanceOf([self.leftNode, self.rightNode], [LeafNode, MultiplicationNode])) {
			Array.combos(numerator, denominator).forEach(function(combo) {
				if (instanceOf(combo, RealNumberNode)) {
					var gcd = commonDenominator(combo[0].value, combo[1].value);
					if (gcd) {
						combo[0].value /= gcd;
						combo[1].value /= gcd;
					}
				} else if (combo[0].equals(combo[1])) {
					replaceNode(combo[0], new RealNumberNode(1));
					replaceNode(combo[1], new RealNumberNode(1));
				}
			});
			$super.simplify();
		}/* else if (instanceOf([self.leftNode], [AdditionNode, SubtractionNode]) && self.rightNode instanceof RealNumberNode) {
			numerator.forEach(function(node) {
				node.rotateLeft(new DivisionNode(null, self.rightNode.value));
			});
			self.leftNode.simplify();
			replaceNode(self.leftNode);
		} */
		
		if (self.leftNode instanceof DivisionNode) { 
			self.rightNode = new MultiplicationNode(self.leftNode.rightNode, self.rightNode);
			self.leftNode = self.leftNode.leftNode;
		}
		
		if (self.denominator.equals(1)) {
			return self.numerator;
		}
	};
	
	function getScopedNodes(node) {
		//if (node instanceof ParenthesisNode) {node = node.leftNode;}
		return node instanceof CommutativeOpNode ? node.nodes : [node];
	}
	
	function replaceNode(node, newNode) {
		var parent = [self, self.leftNode, self.rightNode].find(function(x) {
			return x.nodes.includes(node);
		});
		parent.replace(node, newNode);
	}
}

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}