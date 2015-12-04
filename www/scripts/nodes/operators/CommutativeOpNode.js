/* global OperatorNode, LeafNode  */
/* global ExponentNode, MultiplicationNode */
/* global RealNumberNode, VariableNode */

Object.extend(OperatorNode, CommutativeOpNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} _debugSymbol
 * @param {number} _stickinesss
 * @param {number} identityNumber   the identity number, which may be discarded as it does not change the equation
 * @param {Array} opSortSequence
 */
function CommutativeOpNode(_debugSymbol, _stickinesss, identityNumber, opSortSequence) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, _debugSymbol, _stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
		self.nodes = self.nodes.filter(function(n) {return !n.equals(identityNumber);});
		self.nodes.sort(sortNodes);
	};
	
	function sortNodes(a, b) {
		
		if (a.constructor !== b.constructor) {
			return opSortSequence.indexOf(a.constructor) - opSortSequence.indexOf(b.constructor);
		} else { 
			if (a instanceof MultiplicationNode && a.rightNode instanceof ExponentNode) {a = a.rightNode;}
			if (b instanceof MultiplicationNode && b.rightNode instanceof ExponentNode) {b = b.rightNode;}
			if (instanceOf([a, b], ExponentNode) && instanceOf([a.power, b.power], RealNumberNode)) {
				return b.power.value - a.power.value;
			} else if (a instanceof VariableNode) {
				return a.value > b.value ? 1 : a.value === b.value ? 0 : -1;
			}
		}
	}
	
	this.simplify = function() {
		$super.simplify();
	};
}