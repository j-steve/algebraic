/* global OperatorNode */

function ExponentNode() {
	
	OperatorNode.call(this, '^');

	Object.seal(this);
	
}
Object.extend(OperatorNode, ExponentNode);


function RootNode() {
	
	OperatorNode.call(this, '&radic;');

	Object.seal(this);
	
}
Object.extend(OperatorNode, RootNode);


function LogarithmNode() {
	
	OperatorNode.call(this, 'log');

	Object.seal(this);
	
}
Object.extend(OperatorNode, LogarithmNode);