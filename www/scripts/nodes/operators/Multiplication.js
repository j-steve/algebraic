/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function BaseMultiplicationNode() {
	OperatorNode.apply(this, arguments);
}
Object.extend(OperatorNode, BaseMultiplicationNode);

/**
 * @constructor
 * @extends {BaseMultiplicationNode}
 */
function MultiplicationNode() {
	var self = this;
	
	BaseMultiplicationNode.call(this, '&sdot;', 3);
	 
	var baseCleanup = this.cleanup;
	this.cleanup = function() {
		if (self.hasBothLeafs()) {
			self.replaceWith(new CoefficientNode, true);
		}
	};
}
Object.extend(BaseMultiplicationNode, MultiplicationNode);

/**
 * @constructor
 * @extends {BaseMultiplicationNode}
 */
function CoefficientNode() {
	BaseMultiplicationNode.call(this, 'c', 4);
}
Object.extend(BaseMultiplicationNode, MultiplicationNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function DivisionNode() {
	OperatorNode.call(this, '∕', 3);
}
Object.extend(OperatorNode, DivisionNode);