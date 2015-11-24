/* global OperatorNode */

function AdditionNode() {
	OperatorNode.call(this, '+');
}
Object.extend(OperatorNode, AdditionNode);

function SubtractionNode() {
	OperatorNode.call(this, '&minus;');
}
Object.extend(OperatorNode, SubtractionNode);

function PlusOrMinusNode() {
	OperatorNode.call(this, '&plusmn;');
}
Object.extend(OperatorNode, PlusOrMinusNode);