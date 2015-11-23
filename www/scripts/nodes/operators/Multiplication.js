/* global OperatorNode */

function MultiplicationNode() {
	
	OperatorNode.call(this, '&sdot;');

	Object.seal(this);
	
}
Object.extend(OperatorNode, MultiplicationNode);


function DivisionNode() {
	
	OperatorNode.call(this, '∕');

	Object.seal(this);
	
}
Object.extend(OperatorNode, DivisionNode);