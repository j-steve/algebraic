/* global OperatorNode */

function AdditionNode() {
	OperatorNode.call(this, '+', 2);
}
Object.extend(OperatorNode, AdditionNode);

function SubtractionNode() {
	OperatorNode.call(this, '&minus;', 2);
}
Object.extend(OperatorNode, SubtractionNode);

function PlusOrMinusNode() {
	OperatorNode.call(this, '&plusmn;', 2);
}
Object.extend(OperatorNode, PlusOrMinusNode);