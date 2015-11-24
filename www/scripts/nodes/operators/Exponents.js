/* global OperatorNode */

function ExponentNode() {
	OperatorNode.call(this, '^', 4, true);
}
Object.extend(OperatorNode, ExponentNode);

function RootNode() {
	OperatorNode.call(this, '&radic;');
	Object.seal(this);
}
Object.extend(OperatorNode, RootNode); 