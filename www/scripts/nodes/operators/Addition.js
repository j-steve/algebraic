/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function AdditionNode() {
	OperatorNode.call(this, '+', 2);
}
Object.extend(OperatorNode, AdditionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function SubtractionNode() {
	OperatorNode.call(this, '&minus;', 2);
}
Object.extend(OperatorNode, SubtractionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	OperatorNode.call(this, '&plusmn;', 2);
}
Object.extend(OperatorNode, PlusOrMinusNode);