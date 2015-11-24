/* global OperatorNode */

function ComparisonNode(debugSymbol) {
	OperatorNode.call(this, debugSymbol, 1);
}
Object.extend(OperatorNode, ComparisonNode);

function EqualsNode() {
	ComparisonNode.call(this, '=');
}
Object.extend(ComparisonNode, EqualsNode);

function GreaterThanNode() {
	ComparisonNode.call(this, '&gt;');
}
Object.extend(ComparisonNode, GreaterThanNode);

function LessThanNode() {
	ComparisonNode.call(this, '&lt;');
}
Object.extend(ComparisonNode, LessThanNode);

function GreaterOrEqualNode() {
	ComparisonNode.call(this, '&ge;');
}
Object.extend(ComparisonNode, GreaterOrEqualNode);

function LessOrEqualNode() {
	ComparisonNode.call(this, '&le;');
}
Object.extend(ComparisonNode, LessOrEqualNode);