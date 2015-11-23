/* global OperatorNode */

function ComparisonNode(debugSymbol) {
	OperatorNode.call(this, debugSymbol);

	Object.seal(this);
}
Object.extend(OperatorNode, ComparisonNode);

function EqualsNode() {
	
	ComparisonNode.call(this, '=');

	Object.seal(this);
	
}
Object.extend(ComparisonNode, EqualsNode);


function GreaterThanNode() {
	 
	ComparisonNode.call(this, '&gt;');

	Object.seal(this);
	
}
Object.extend(ComparisonNode, GreaterThanNode);


function LessThanNode() {
	
	ComparisonNode.call(this, '&lt;');

	Object.seal(this);
	
}
Object.extend(ComparisonNode, LessThanNode);


function GreaterOrEqualNode() {
	
	ComparisonNode.call(this, '&ge;');

	Object.seal(this);
	
}
Object.extend(ComparisonNode, GreaterOrEqualNode);


function LessOrEqualNode() {
	
	ComparisonNode.call(this, '&le;');

	Object.seal(this);
	
}
Object.extend(ComparisonNode, LessOrEqualNode);