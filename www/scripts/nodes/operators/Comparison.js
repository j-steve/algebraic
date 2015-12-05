/* global OperatorNode, SIDES, VariableNode, AdditionNode, MultiplicationNode, DivisionNode, ExponentNode */

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
		
		var varSide = getSideWithVar(self);
		var noVarSide = getSideWithoutVar(self);
		while (noVarSide && varSide instanceof OperatorNode) { 
			var partToSwap = getSideWithoutVar(varSide);
			var partToKeep = getSideWithVar(varSide);
			if (!partToSwap || !partToKeep) {break;}
			
			if (varSide instanceof AdditionNode) {
				var addNegative = new AdditionNode(new NegativeNode(partToSwap));
				self.rotateLeft(noVarSide, addNegative);
				
			/*} else if (varSide instanceof SubtractionNode) {
				if (partToSwap === varSide.rightNode) { 
					self.rotateLeft(noVarSide, new AdditionNode(partToSwap));
				} else {  
					var subtractor = noVarSide.rotateLeft(new SubtractionNode(null, partToSwap));  
					var neg1Multiplier = subtractor.rotateLeft(new MultiplicationNode(null, -1)); 
					neg1Multiplier.cleanup(); 
				}
			*/	
			} else if (varSide instanceof MultiplicationNode) {
				self.rotateLeft(noVarSide, new DivisionNode(partToSwap));
				
			} else if (varSide instanceof DivisionNode) {
				if (partToSwap === varSide.rightNode) { 
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
			
			varSide = getSideWithVar(self);
			noVarSide = getSideWithoutVar(self);
		}
		 
		if (varSide === self.rightNode) {
			self.replace(self.leftNode, self.rightNode, false);
		}
		
		$super.simplify();
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