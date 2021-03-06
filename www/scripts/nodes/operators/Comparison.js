/* global OperatorNode, SIDES, VariableNode, NegativeNode, AdditionNode, MultiplicationNode, DivisionNode, ExponentNode */

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} _debugSymbol
 */
function ComparisonNode(_debugSymbol) {
	var self = this;
	var $super = ComparisonNode.$super(this, _debugSymbol, 1);
	
	this.simplify = function() {
		$super.simplify();
		
		replaceParens();
		var varSide = getSideWithVar(self);
		var noVarSide = getSideWithoutVar(self);

		while (noVarSide && varSide instanceof OperatorNode) { 
			
			if (varSide instanceof NegativeNode) {
				self.rotateLeft(noVarSide, new NegativeNode());
				self.replace(varSide, varSide.leftNode);
			
			} else {
				var partToSwap = getSideWithoutVar(varSide);
				var partToKeep = getSideWithVar(varSide);
				if (!partToSwap || !partToKeep) {break;}

				if (varSide instanceof AdditionNode) {
					var addNegative = new AdditionNode(new NegativeNode(partToSwap));
					self.rotateLeft(noVarSide, addNegative);

				} else if (varSide instanceof MultiplicationNode) {
					self.rotateLeft(noVarSide, new DivisionNode(partToSwap));

				} else if (varSide instanceof DivisionNode) {
					if (partToSwap === varSide.denominator) { 
						self.rotateLeft(noVarSide, new MultiplicationNode(partToSwap));
					} else { // x is the denominator, e.g. "2/x", so multiply other side by x to solve.
						self.rotateLeft(noVarSide, new MultiplicationNode(partToKeep));
						partToKeep = partToSwap;
					} 

				} else if (varSide instanceof ExponentNode) {
					if (partToSwap === varSide.rightNode) { 
						self.rotateRight(noVarSide, new NthRootNode(partToSwap));
					} else { // x is the exponent, e.g., 2^x
						self.rotateRight(noVarSide, new LogarithmNode(partToSwap)); 
					}

				} else {
					alert('breakin up is hard');
					break;
				}
				self.replace(varSide, partToKeep, false);
			}
			
			replaceParens();
			varSide = getSideWithVar(self);
			noVarSide = getSideWithoutVar(self);
		}
		 
		if (varSide === self.rightNode && noVarSide === self.leftNode) {
			self.leftNode = varSide;
			self.rightNode = noVarSide;
		}
		
		self.leftNode = self.leftNode.simplify() || self.leftNode;
		self.rightNode = self.rightNode.simplify() || self.rightNode; 
	};
	
	
	var hasVariable = function(x) {return x instanceof VariableNode;};
	
	function getSideWithVar(node) { 
		return node.nodes.find(function(node) {
			return hasVariable(node) || node.decendants().some(hasVariable);
		});
	}
	
	function getSideWithoutVar(node) {
		return node.nodes.find(function(node) {
			return !hasVariable(node) && !node.decendants().some(hasVariable);
		});
	}
	
	function replaceParens() {
		self.nodes.forEach(function(n) {
			if (n instanceof ParenthesisNode) {
				self.replace(n, n.leftNode);
			}
		});
	}
	
}
Object.extend(OperatorNode, ComparisonNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function EqualsNode() {
	EqualsNode.$super(this, '=');
}
Object.extend(ComparisonNode, EqualsNode);

/**
 * @constructor 
 * @extends {ComparisonNode}
 */
function GreaterThanNode() {
	GreaterThanNode.$super(this, '&gt;');
}
Object.extend(ComparisonNode, GreaterThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessThanNode() {
	LessThanNode.$super(this, '&lt;');
}
Object.extend(ComparisonNode, LessThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function GreaterOrEqualNode() {
	GreaterOrEqualNode.$super(this, '&ge;');
}
Object.extend(ComparisonNode, GreaterOrEqualNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessOrEqualNode() {
	LessOrEqualNode.$super(this, '&le;');
}
Object.extend(ComparisonNode, LessOrEqualNode);