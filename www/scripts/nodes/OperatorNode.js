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
	
	BaseNode.call(this);

	/**
	 * Set to {@code true} if this node is surrounded by parenthesis.
	 * @type {boolean}
	 */
	this.parenthesis = !!parenthesis;
	
	this.printVals.before =  '<div class="node operator-node">';

	Object.defineProperty(this, 'operator', {
		configurable: false,
		get: function() {return operator;},
		set: function(value) {
			this.printVals.middle = operator ? ('<div class="operator">' + operator.debugSymbol + '</div>') : '';
			operator = value;
		}
	});

    // ================================================================================
    // Methods
    // ================================================================================

	this._setParent = function(newParentNode, newSide) {
		self.parent = newParentNode; 
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
			if (self.parent) {self.parent[side] = opNode._setParent(self.parent, side);}
			opNode.leftNode = self._setParent(opNode, 'leftNode');
		}
		return opNode;
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
		if (this.parenthesis) {result += '(';}
		if (operator) {result += operator.leftNodeSymbol;}
		if (self.leftNode) {result += self.leftNode.prettyInput();}
		if (operator) {result += operator.openSymbol;}
		if (self.rightNode) {result += self.rightNode.prettyInput();}
		if (operator) {result += operator.closeSymbol;}
		if (this.parenthesis) {result += ')';}
		return result;
	};
	
	/**
	 * @param {OperatorNode} parentNode
	 */
	this.cleanup = function(parentNode) {
		if (self.parenthesis) {
			if (!self.rightNode) { // If operator is parenthesis with just 1 value, no need for parenthesis.
				self.parenthesis = false;
			}
			if (!self.operator || !parentNode || !parentNode.operator || parentNode.operator.isTighterThan(self.operator)) {
				//this.parenthesis = false;
			}
		}
		['leftNode', 'rightNode'].forEach(function(side) {
			if (self[side] instanceof OperatorNode) {
				self[side].cleanup(self);
			}
		});
	};
	
	this.simplify = function() {
		if (operator === Operators.Equals) { //jshint ignore:line
			var sides = ['rightNode', 'leftNode'];
			var numericSide = sides.find(function(s) {return self[s] && self[s].isNumeric();});
			var nonNumericSide = sides.find(function(s) {return self[s] && !self[s].isNumeric();});
			while (numericSide && nonNumericSide && self[nonNumericSide].operator) {
				var operandSide = sides.find(function(s) {return self[nonNumericSide][s] && self[nonNumericSide][s].isNumeric();});
				var variableSide = sides.find(function(s) {return self[nonNumericSide][s] && !self[nonNumericSide][s].isNumeric();});
				var operandNode = self[nonNumericSide][operandSide];
				var variableNode = self[nonNumericSide][variableSide];
				
				var opNode;
				if (self[nonNumericSide].operator === Operators.Exponent) {
					var inverseOp = (operandSide === 'leftNode') ? Operators.Logarithm : Operators.Root;
					opNode = new OperatorNode(inverseOp, parenthesis);
					opNode.leftNode = self[nonNumericSide][operandSide];
					opNode.rightNode = self[numericSide];
				} else {
					opNode = new OperatorNode(self[nonNumericSide].operator.inverse, parenthesis);
					opNode.leftNode = self[numericSide];//.setParent(opNode, 'leftNode');
					opNode.rightNode = self[nonNumericSide][operandSide];//.setParent(opNode, 'rightNode');
				}
				self.leftNode = variableNode;//.setParent(self, numericSide);
				self.rightNode = opNode;//.setParent(self, nonNumericSide);
				
				
				numericSide = sides.find(function(s) {return self[s] && self[s].isNumeric();});
				nonNumericSide = sides.find(function(s) {return self[s] && !self[s].isNumeric();});
			}
		}
	};

	this.calculate = function() {
		
		var left = self.leftNode ? self.leftNode.calculate() : null;
		var right = self.rightNode ? self.rightNode.calculate() : null;
		
		if (operator === Operators.Equals) { //jshint ignore:line
			return left + '=' + right;
		}
		if (!self.isNumeric()) {return self.prettyInput();}
	

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

	this.operator = operator;

	Object.seal(this);
}

Object.extend(BaseNode, OperatorNode);