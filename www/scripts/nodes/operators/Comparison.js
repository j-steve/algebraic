/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ComparisonNode(debugSymbol) {
	var self = this;
	OperatorNode.call(this, debugSymbol, 1);
	
	var baseCleanup = this.cleanup;
	this.cleanup = function() {
		baseCleanup.call(self);
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
	ComparisonNode.call(this, '=');
}
Object.extend(ComparisonNode, EqualsNode);

/**
 * @constructor 
 * @extends {ComparisonNode}
 */
function GreaterThanNode() {
	ComparisonNode.call(this, '&gt;');
}
Object.extend(ComparisonNode, GreaterThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessThanNode() {
	ComparisonNode.call(this, '&lt;');
}
Object.extend(ComparisonNode, LessThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function GreaterOrEqualNode() {
	ComparisonNode.call(this, '&ge;');
}
Object.extend(ComparisonNode, GreaterOrEqualNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessOrEqualNode() {
	ComparisonNode.call(this, '&le;');
}
Object.extend(ComparisonNode, LessOrEqualNode);