/* global CommutativeOpNode, OperatorNode, LeafNode, RealNumberNode, ExponentNode, LogarithmNode, SIDES */

Object.extend(CommutativeOpNode, MultiplicationNode);
/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function MultiplicationNode(_leftNode, _rightNode) {
	var self = this;
	var $super = MultiplicationNode.$super(this, '&sdot;', 3, MultiplicationNode, multiply);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.simplify = function() {
		$super.simplify();
		if (self.leftNode instanceof RealNumberNode && self.leftNode.value === 1) {
			self.replaceWith(self.rightNode);
		}
	};
	
	function multiply(a, b) { 
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value * b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new ExponentNode(a, 2);
			
		} else if (a instanceof ExponentNode && a.leftNode.equals(b)) {
			var _rightNode = new AdditionNode(a.rightNode, 1);
			return new ExponentNode(a.leftNode, _rightNode);
			
		} else if (b instanceof ExponentNode && b.leftNode.equals(a)) {
			var _rightNode = new AdditionNode(b.rightNode, 1);
			return new ExponentNode(b.leftNode, _rightNode);
		
		} else if (a instanceof ExponentNode && b instanceof ExponentNode && a.leftNode.equals(b.leftNode)) {
			var _rightNode = new AdditionNode(a.rightNode, b.rightNode);
			return new ExponentNode(a.leftNode, _rightNode);
			
		} else if (b instanceof DivisionNode) {
			var newMultiply = new MultiplicationNode(b.leftNode, a);
			return new DivisionNode(newMultiply, b.rightNode);
		}
	}
	
	this.isCoefficient = function() {
		for (var i = 0; i < SIDES.length; i++) { 
			var node = self[SIDES[i]];
			if (!(node instanceof LeafNode || node instanceof ExponentNode && node.leftNode instanceof LeafNode ||
					node instanceof MultiplicationNode && node.isCoefficient())) {
				return false;
			}
		}
		return true;
	};
	
	this.toString = function() {
		if (self.isCoefficient()) {
			self.printVals.before = self.printVals.before.replace('node', 'node coefficient');
		} 
		return $super.toString();
	}; 
}


Object.extend(OperatorNode, DivisionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function DivisionNode(_leftNode, _rightNode) {
	var self = this; 
	var $super = DivisionNode.$super(this, '∕', 3);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
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
					combo[0].replaceWith(new RealNumberNode(1));
					combo[1].replaceWith(new RealNumberNode(1));
				} else if (instanceOf(combo, [ExponentNode, LeafNode])) {
					
				}
			});
			$super.simplify();
		} else if (instanceOf([self.leftNode], [AdditionNode, SubtractionNode]) && self.rightNode instanceof RealNumberNode) {
			numerator.forEach(function(node) {
				node.rotateLeft(new DivisionNode(null, self.rightNode.value));
			});
			self.leftNode.simplify();
			self.replaceWith(self.leftNode);
		}
		

		if (self.rightNode instanceof RealNumberNode && self.rightNode.value === 1) {
			self.replaceWith(self.leftNode);
		} else if (self.leftNode instanceof DivisionNode) { 
			self.rightNode = new MultiplicationNode(self.leftNode.rightNode, self.rightNode);
			self.leftNode = self.leftNode.leftNode;
			self.simplify();
		}
	};
	
	function getScopedNodes(node) {
		//if (node instanceof ParenthesisNode) {node = node.leftNode;}
		return node instanceof CommutativeOpNode ? node.getLeafsInScope() : [node];
	}
}

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}

