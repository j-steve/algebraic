/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function AdditionNode() {
	AdditionNode.$super(this, '+', 2);
}
Object.extend(OperatorNode, AdditionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function SubtractionNode() {
	SubtractionNode.$super(this, '&minus;', 2);
}
Object.extend(OperatorNode, SubtractionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	PlusOrMinusNode.$super(this, '&plusmn;', 2);
}
Object.extend(OperatorNode, PlusOrMinusNode);