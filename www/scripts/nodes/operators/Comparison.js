/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ComparisonNode(debugSymbol) {
	var self = this;
	var $super = ComparisonNode.$super(this, debugSymbol, 1);
	
	this.cleanup = function() {
		$super.cleanup();
		/*while (self.leftNode instanceof OperatorNode) {
			var variable = lefty.leftNode.getNodeOfType(VariableNode);
			var coefficient = self.leftNode.getNodeOfType(RealNumberNode);
			var leftNodes = self.leftNode.decendants();
			if (leftNodes.any(function(node) {return node instanceof VariableNode;}))
		}*/
	};
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