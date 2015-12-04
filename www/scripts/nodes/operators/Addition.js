/* global OperatorNode, RealNumberNode, LeafNode, MultiplicationNode, CommutativeOpNode, DivisionNode, VariableNode */
/* global LogarithmNode, NthRootNode, ExponentNode, ConstantNode */


/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function AdditionNode(_leftNode, _rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2, 0, sortNodes, add);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
	};
	
	function sortNodes(a, b) {
		if (a instanceof MultiplicationNode && a.rightNode instanceof ExponentNode) {a = a.rightNode;}
		if (b instanceof MultiplicationNode && b.rightNode instanceof ExponentNode) {b = b.rightNode;}
		
		if (instanceOf([a, b], ExponentNode) && instanceOf([a.power, b.power], RealNumberNode)) {
			return b.power.value - a.power.value;
		} else {
			var OP_SEQ = [ExponentNode, MultiplicationNode, VariableNode, RealNumberNode, ConstantNode];
			var aIndex = OP_SEQ.indexOf(a.constructor), bIndex = OP_SEQ.indexOf(b.constructor);
			if (aIndex > -1 && bIndex > -1) {return aIndex - bIndex;}
		}
	}
	
	this.simplify = function() {
		$super.simplify();
		for (var i = 1; i <= self.nodes.length; i++) {
			var a = self.nodes[self.nodes.length - i];
			for (var j = self.nodes.length - 1; j >= 0; j--) {
				var b = self.nodes[j];
				if (a !== b) {
					var result = add(a, b);
					if (result) {
						self.replace(b, null);
						self.replace(a, result);
						result.simplify();
						a = result;
					}
				}
			}
		}
	};
	
	function add(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			a.value += b.value;
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new MultiplicationNode(2, a);
		} else if (a instanceof MultiplicationNode && a.rightNode.equals(b)) {
			a.leftNode = new AdditionNode(a.leftNode, 1);
		} else if (a instanceof MultiplicationNode && b instanceof MultiplicationNode && sameFactors(a, b)) {
			a.leftNode = new AdditionNode(a.leftNode, b.leftNode);
		} else {
			return null;
		}
		return a; 
	}
	
	function sameFactors(a, b) {
		if (!instanceOf([a.leftNode, b.leftNode], RealNumberNode)) {return false;}
		
		var aFactors = a.nodes.slice(1);
		var bFactors = b.nodes.slice(1);
		for (var i = 0; i < aFactors.length; i++) {
			var aNode = aFactors[i];
			var bNode = bFactors.find(function(x) {return aNode.equals(x);});
			if (!bNode) {return false;}
			var bIndex = bFactors.indexOf(bNode);
			bFactors.splice(bIndex, 1);
		}
		return true;
	}
}
Object.extend(CommutativeOpNode, AdditionNode);


Object.extend(OperatorNode, SubtractionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function SubtractionNode(_leftNode, _rightNode) {
	var self = this;
	var $super = SubtractionNode.$super(this, '&minus;', 2);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
	};
}


Object.extend(OperatorNode, PlusOrMinusNode);
/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	PlusOrMinusNode.$super(this, '&plusmn;', 2);
}