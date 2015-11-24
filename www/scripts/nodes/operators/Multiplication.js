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
		baseCleanup.call(self);
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
	BaseMultiplicationNode.call(this, '<span style="color:gray;">&sdot;</span>', 4);
}
Object.extend(BaseMultiplicationNode, CoefficientNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function DivisionNode() {
	var self = this;
	
	OperatorNode.call(this, '∕', 3);
	
	var baseCleanup = this.cleanup;
	this.cleanup = function() {
		baseCleanup.call(self); 
		if (self.hasBothLeafs()) {
			var gcd = commonDenominator(self.leftNode.value, self.rightNode.value);
			if (gcd) {
				self.leftNode.value = self.leftNode.value / gcd;
				self.rightNode.value = self.rightNode.value / gcd;
			}
			if (self.rightNode.value === 1) {
				self.replaceWith(self.leftNode);
			}
		}
		/*if (self.rightNode instanceof RealNumberNode && self.leftNode.value !== 1) {
			var oneOver = new DivisionNode;
			oneOver.leftNode = new RealNumberNode(1);
			oneOver.rightNode = self.rightNode;
			self.rightNode = oneOver;
			self.replaceWith(new MultiplicationNode, true);
		}*/
	};
}
Object.extend(OperatorNode, DivisionNode);

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}