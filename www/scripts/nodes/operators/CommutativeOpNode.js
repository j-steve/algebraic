/* global OperatorNode, LeafNode, SIDES */


Object.extend(OperatorNode, CommutativeOpNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} _debugSymbol
 * @param {number} _stickinesss
 * @param {Function} operatorFunction
 * @param {boolean} reverseSequence
 */
function CommutativeOpNode(_debugSymbol, _stickinesss, operatorFunction) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, _debugSymbol, _stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
	};
	
	this.simplify = function() {
		$super.simplify();
	};
}