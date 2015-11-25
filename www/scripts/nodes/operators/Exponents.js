/* global OperatorNode, OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ExponentNode(leftNode, rightNode) {
	ExponentNode.$super(this, '^', 4, true);
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function RootNode() {
	RootNode.$super(this, '&radic;');
}
Object.extend(OperatorNode, RootNode); 

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 */
function LogarithmNode(base) {  
	LogarithmNode.$super(this, 'log', 3);
	this.leftNode = base || new RealNumberNode(10);
}
Object.extend(OperatorPrefixNode, LogarithmNode);