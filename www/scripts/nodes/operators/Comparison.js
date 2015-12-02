/* global OperatorNode, SIDES, VariableNode, AdditionNode, SubtractionNode, MultiplicationNode, DivisionNode, ExponentNode */

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
		$super.simplify()
		
		var varSide = getSideWithVar(self);
		var noVarSide = getSideWithoutVar(self);
		while (noVarSide && varSide instanceof OperatorNode) { 
			var partToSwap = getSideWithoutVar(varSide);
			var partToKeep = getSideWithVar(varSide);
			if (!partToSwap || !partToKeep) {break;}
			
			if (varSide instanceof AdditionNode) {
				noVarSide.rotateLeft(new SubtractionNode(null, partToSwap));
				
			} else if (varSide instanceof SubtractionNode) {
				if (partToSwap === varSide.rightNode) { 
					noVarSide.rotateLeft(new AdditionNode(null, partToSwap));
				} else {  
					var subtractor = noVarSide.rotateLeft(new SubtractionNode(null, partToSwap));  
					var neg1Multiplier = subtractor.rotateLeft(new MultiplicationNode(null, -1)); 
					neg1Multiplier.cleanup(); 
				}
				
			} else if (varSide instanceof MultiplicationNode) {
				noVarSide.rotateLeft(new DivisionNode(null, partToSwap));
				
			} else if (varSide instanceof DivisionNode) {
				if (partToSwap === varSide.rightNode) { 
					noVarSide.rotateLeft(new MultiplicationNode(null, partToSwap));
				} else { // x is the denominator, e.g. "2/x", so multiply other side by x to solve.
					noVarSide.rotateLeft(new MultiplicationNode(null, partToKeep));
					partToKeep = partToSwap;
				} 
				
			} else if (varSide instanceof ExponentNode) {
				if (partToSwap === varSide.rightNode) { 
					noVarSide.rotateRight(new RootNode(partToSwap, null));
				} else { // x is the exponent, e.g., 2^x
					noVarSide.rotateRight(new LogarithmNode(partToSwap, null)); 
				}
				
			} else {
				alert('breakin up is hard');
				break;
			}
			varSide.replaceWith(partToKeep, false, true);
			
			varSide = getSideWithVar(self);
			noVarSide = getSideWithoutVar(self);
		}
		
		if (noVarSide) {
			noVarSide.cleanup();
			noVarSide.simplify(); 
			if (varSide === self.rightNode) {
				self.leftNode.replaceWith(self.rightNode, false, true);
			}
		}
		
		
		/*while (self.leftNode instanceof OperatorNode) {
			var variable = lefty.leftNode.getNodeOfType(VariableNode);
			var coefficient = self.leftNode.getNodeOfType(RealNumberNode);
			var leftNodes = self.leftNode.decendants();
			if (leftNodes.any(function(node) {return node instanceof VariableNode;}))
		}*/
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