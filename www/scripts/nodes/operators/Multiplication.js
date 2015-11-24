/* global OperatorNode */

function MultiplicationNode() {
	OperatorNode.call(this, '&sdot;', 3);
}
Object.extend(OperatorNode, MultiplicationNode);

function DivisionNode() {
	OperatorNode.call(this, '∕', 3);
}
Object.extend(OperatorNode, DivisionNode);