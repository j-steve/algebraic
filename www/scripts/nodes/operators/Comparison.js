/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ComparisonNode(debugSymbol) {
	OperatorNode.call(this, debugSymbol, 1);
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