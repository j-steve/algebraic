/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ExponentNode() {
	OperatorNode.call(this, '^', 4, true);
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function RootNode() {
	OperatorNode.call(this, '&radic;');
}
Object.extend(OperatorNode, RootNode); 