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
 * @param {Function} operate
 */
function CommutativeOpNode(_debugSymbol, _stickinesss, identityNumber, opSortSequence, operate, printSymbol) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, _debugSymbol, _stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
		self.nodes.sort(opSortSequence);
	};
	
	this.simplify = function() {
		$super.simplify();
		self.nodes = self.nodes.filter(function(n) {return !n.equals(identityNumber);}); 
		
		for (var i = 1; i <= self.nodes.length; i++) {
			var a = self.nodes[self.nodes.length - i];
			for (var j = self.nodes.length - 1; j >= 0; j--) {
				var b = self.nodes[j];
				if (a !== b) {
					var result = operate(a, b);
					if (result) {
						result = result.simplify() || result;
						self.replace(b, null);
						self.replace(a, result);
						a = result;
					}
				}
			}
		}
	};
	
	
	this.toString = function() {
		var result = self.printVals.before; 
		if (self.leftNode) {result += '<span class="leftNode">' + self.leftNode + '</span>';}
		for (var i = 1; i < self.nodes.length; i++) { 
			result += printSymbol(self.nodes[i], self.nodes[i-1]) || self.printVals.middle;
			result += '<span class="rightNode">' + self.nodes[i] + '</span>';
		}
		return result + self.printVals.after;
	};
}