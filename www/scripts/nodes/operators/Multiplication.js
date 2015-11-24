/* global OperatorNode */

function MultiplicationNode() {
	OperatorNode.call(this, '&sdot;');
}
Object.extend(OperatorNode, MultiplicationNode);

function DivisionNode() {
	OperatorNode.call(this, '∕');
}
Object.extend(OperatorNode, DivisionNode);