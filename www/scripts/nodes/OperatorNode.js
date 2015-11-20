/* global Operator */
/* global LeafNode */

/**
 * @constructor
 * 
 * @param {Operator} operator
 * @param {boolean} parenthesis
 * @returns {OperatorNode}
 */
function OperatorNode(operator, parenthesis) {
	'use strict';

	var self = this;

	/**
	 * The side of the parent node on which this node appears: either 'leftNode' or 'rightNode'. 
	 * @type {string}
	 */
	var side = null;

    // ================================================================================
    // Public Properties
    // ================================================================================

	/**
	 * The parent of this node.
	 * @type {OperatorNode}
	 */
	this.parentNode = null;

	/**
	 * This node's first (i.e. left) child
	 * @type {LeafNode|OperatorNode}
	 */
	this.leftNode = null;

	/**
	 * This node's second (i.e. right) child
	 * @type {LeafNode|OperatorNode}
	 */
	this.rightNode = null;

	/**
	 * Set to {@code true} if this node is surrounded by parenthesis.
	 * @type {boolean}
	 */
	this.parenthesis = !!parenthesis;

	Object.defineProperty(this, 'operator', {
		configurable: false,
		get: function() {return operator;},
		set: function(value) {
			if (!(value instanceof Operator)) {throw new TypeError('Invalid type: ' + value);}
			operator = value;
		}
	});

    // ================================================================================
    // Methods
    // ================================================================================

	this._setParent = function(newParentNode, newSide) {
		self.parentNode = newParentNode;
		side = newSide;
		return self;
	};

	/**
	 * @param {LeafNode} newLeafNode 
	 */
	this.setLeaf = function(newLeafNode) {
		if (!self.leftNode) {
			self.leftNode = newLeafNode;
		} else if (!self.rightNode) {
			self.rightNode = newLeafNode;
		} else {
			throw new Error('both set already');
		}
	};

	this.addChildNode = function(operator, parenthesis) {
		var opNode = new OperatorNode(operator, parenthesis);
		var emptySide = ['leftNode', 'rightNode'].find(function(s) {return !self[s];});
		if (emptySide) {
			self[emptySide] = opNode._setParent(self, emptySide);
		} else {
			if (self.parentNode) {self.parentNode[side] = opNode._setParent(self.parentNode, side);}
			opNode.leftNode = self._setParent(opNode, 'leftNode');
		}
		return opNode;
	};

	this.replaceChildNode = function(operator, parenthesis) {
		var occupiedSide = ['rightNode', 'leftNode'].find(function(s) {return !!self[s];});
		if (!occupiedSide) {throw new Error('No nodes to replace.');}
		var opNode = new OperatorNode(operator, parenthesis);
		opNode.leftNode = self[occupiedSide];
		self[occupiedSide] = opNode._setParent(self, occupiedSide);
		return self[occupiedSide];
	};
	
	
	this.isNumeric = function() {
		return (!this.leftNode || this.leftNode.isNumeric()) && (!this.rightNode || this.rightNode.isNumeric());
	};
	

	this.print = function(parentElement) {
		var newElement = document.createElement('div');
		newElement.className = 'node operator-node';

		if (self.parenthesis) {newElement.innerHTML += '(';}
		if (self.leftNode) {self.leftNode.print(newElement);} 

		var operatorElement = document.createElement('div');
		operatorElement.className = 'operator' + (operator ? '' : ' operator-unknown');
		operatorElement.innerHTML += operator ? operator.debugSymbol : '?';
		newElement.appendChild(operatorElement); 

		if (self.rightNode) {self.rightNode.print(newElement);}
		if (self.parenthesis) {newElement.innerHTML += ')';}

		parentElement.appendChild(newElement);
	};

	this.prettyInput = function() {
		var result = ''; 
		if (self.leftNode) {result += self.leftNode.prettyInput();}
		if (operator) {result += operator.openSymbol;}
		if (self.rightNode) {result += self.rightNode.prettyInput();}
		if (operator) {result += operator.closeSymbol;}
		return result;
	};
	
	this.simplify = function() {
		if (operator === Operators.Equals) { //jshint ignore:line
			var sides = ['rightNode', 'leftNode'];
			var numericSide = sides.find(function(s) {return self[s] && self[s].isNumeric();});
			var nonNumericSide = sides.find(function(s) {return self[s] && !self[s].isNumeric();});
			if (numericSide && nonNumericSide) {
				var operandSide = sides.find(function(s) {return self[nonNumericSide][s] && self[nonNumericSide][s].isNumeric();});
				var variableSide = sides.find(function(s) {return self[nonNumericSide][s] && !self[nonNumericSide][s].isNumeric();});
				var operandNode = self[nonNumericSide][operandSide];
				var variableNode = self[nonNumericSide][variableSide];
				
				var opNode = new OperatorNode(self[nonNumericSide].operator.inverse, parenthesis);
				opNode.leftNode = self[numericSide];//.setParent(opNode, 'leftNode');
				opNode.rightNode = self[nonNumericSide][operandSide];//.setParent(opNode, 'rightNode');
				self[nonNumericSide] = opNode;//.setParent(self, nonNumericSide);
				self[numericSide] = variableNode;//.setParent(self, numericSide);
			}
		}
	};

	this.calculate = function() {
		var left = self.leftNode ? self.leftNode.calculate() : null;
		var right = self.rightNode ? self.rightNode.calculate() : null;

		if (operator) {
			return operator.calculate(left, right);
		} else if (!self.rightNode) {
			return left;
		} else {
			throw new Error('Cannot solve: missing operator.');
		}
	};

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
}