/* global OperatorNode */

function AdditionNode() {
	
	OperatorNode.call(this, '+');
	
	this.printVals.before += '(';
	
	this.printVals.after = ')' + this.printVals.after;

	Object.seal(this);
	
}
Object.extend(OperatorNode, AdditionNode);


function SubtractionNode() {
	
	OperatorNode.call(this, '&minus;');

	Object.seal(this);
	
}
Object.extend(OperatorNode, SubtractionNode);


function PlusOrMinusNode() {
	
	OperatorNode.call(this, '&plusmn;');

	Object.seal(this);
	
}
Object.extend(OperatorNode, PlusOrMinusNode);