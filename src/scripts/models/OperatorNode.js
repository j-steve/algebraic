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
	}

	this.setLeaf = function(leafValue) {
		var leaf = new LeafNode(leafValue);
		if (!self.leftNode) {
			self.leftNode = leaf;
		} else if (!self.rightNode) {
			self.rightNode = leaf;
		} else {
			throw new Error('both set already');
		}
	};

	this.addChildNode = function(operator, parenthesis) {
		var opNode = new OperatorNode(operator, parenthesis);
		var emptySide = ['leftNode', 'rightNode'].find(function(s) {return !self[s];})
		if (emptySide) {
			self[emptySide] = opNode._setParent(self, emptySide);
		} else {
			if (self.parentNode) {self.parentNode[side] = opNode._setParent(self.parentNode, side);}
			opNode.leftNode = self._setParent(opNode, 'leftNode');
		}
		return opNode;
	};

	this.replaceChildNode = function(operator, parenthesis) {
		var occupiedSide = ['rightNode', 'leftNode'].find(function(s) {return !!self[s];})
		if (!occupiedSide) {throw new Error('No nodes to replace.');}
		var opNode = new OperatorNode(operator, parenthesis);
		opNode.leftNode = self[occupiedSide];
		return self[occupiedSide] = opNode._setParent(self, occupiedSide);
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

	this.solve = function() {
		var left = self.leftNode ? self.leftNode.solve() : null;
		var right = self.rightNode ? self.rightNode.solve() : null;

		if (operator) {
			return operator.solve(left, right);
		} else if (!self.rightNode) {
			return left;
		} else {
			return 'ERR!';
		}
	}

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
}

/**
 * The representation of operands, i.e., the terminus ("leaf") nodes 
 * representing numbers, variables, or constants rather than functions/mathmematical operations.
 * 
 * @param {*} value
 */
function LeafNode(value) {
	'use strict';

	this._parentNode = null;

	Object.defineProperty(this, 'parentNode', {
		get: function() {return this._parentNode;}
	});

	Object.defineProperty(this, 'value', {
		get: function() {return value;}
	});

	this.print = function(parentElement) { 
		var newElement = document.createElement('div');
		newElement.className = 'node leaf-node';
		newElement.innerHTML += this.value;
		parentElement.appendChild(newElement);
	};

	this.prettyInput = function() {
		return this.value;
	};

	this.solve = function() {
		return Number(value);
	}

	Object.seal(this);
};