/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function MultiplicationNode() {
	OperatorNode.call(this, '&sdot;', 3);
}
Object.extend(OperatorNode, MultiplicationNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function DivisionNode() {
	OperatorNode.call(this, '∕', 3);
}
Object.extend(OperatorNode, DivisionNode);