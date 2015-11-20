/* global makeEquationTree */

function compute(equation, treeTableElement, prettyInputElement, simplifyElement, calculateElement) {
	'use strict';

	treeTableElement.innerHTML = '';
	prettyInputElement.innerHTML = '';
	simplifyElement.innerHTML = '';
	calculateElement.innerHTML = '';

	try {
		var rootNode = makeEquationTree(equation.value);

		// Output results
		rootNode.print(treeTableElement);
		prettyInputElement.innerHTML = '<span>' + rootNode.prettyInput() + '</span>';
		calculateElement.innerHTML = rootNode.calculate();
		rootNode.simplify();
		simplifyElement.innerHTML = rootNode.prettyInput();
	} catch (err) {
		prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	}
}
;/* global Operators */
/* global Operator */
/* global LeafNode */
/* global parseInput */

/**
 * @param {string} inputEquation
 * @returns {OperatorNode}
 */
function makeEquationTree(inputEquation) {
	
	var activeNode = new OperatorNode();
	for (var i = 0; i < inputEquation.length;) {
		var match = parseInput(inputEquation.substring(i));
		if (match.type === 'OPEN-PAREN') {
			if (activeNode.rightNode) {   // catches "1^2(3..."
				activeNode = activeNode.replaceChildNode(Operators.Multiply);
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.operator) { // catches "1^2(..."
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.leftNode) { // catches "2(3..."
				activeNode.operator = Operators.Multiply;
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.parentNode && !activeNode.parenthesis) {
				activeNode = activeNode.addChildNode(null, true);
			} else {
				activeNode.parenthesis = true;
			}
		} else if (match.type === 'CLOSE-PAREN') {
			while (!activeNode.parenthesis) {
				activeNode = activeNode.parentNode;
				if (!activeNode) {throw new Error(String.format('Unmatched parenthesis at position {0}.', i+1));}
			}
			activeNode = activeNode.parentNode;
		} else if (match.type instanceof Operator) {
			
			/** @type {Operator} */ var operator = match.type;
			if (!activeNode.operator) {
				activeNode.operator = operator;
			} else {
				while (!activeNode.parenthesis && activeNode.operator.isTighterThan(operator) && activeNode.parentNode) {
					activeNode = activeNode.parentNode;
				}
				if (activeNode.rightNode && !activeNode.operator.isTighterThan(operator)) {
					activeNode = activeNode.replaceChildNode(operator);
				} else if (activeNode.parenthesis) {
					activeNode.parenthesis = false;
					activeNode = activeNode.parentNode.replaceChildNode(operator);
					activeNode.parenthesis = true;

				} else {
					activeNode = activeNode.addChildNode(operator);
				}
			}
		} else if (match.type instanceof LeafNode) {
			
			/** @type {LeafNode} */ var leafNode = match.type;
			
			if (activeNode.rightNode) { // catches "43^4x..."
				// TODO - make "5xy" evaluate left to right
				if (!activeNode.parentNode) {
					var opNode = new OperatorNode(Operators.Coefficient);
					opNode.leftNode = activeNode._setParent(opNode, 'leftNode');
					opNode.setLeaf(leafNode);
					activeNode = activeNode.parentNode;
				} else {
					activeNode = activeNode.parentNode.replaceChildNode(Operators.Coefficient);
					activeNode.setLeaf(leafNode);
				}
			} else if (activeNode.operator || !activeNode.leftNode) { // If it's totally empty or has operator but no rightNode then it's ready for a leaf. (Catches "4+x...")
				activeNode.setLeaf(leafNode);
			} else { // catches "4x..." 
				activeNode.operator = Operators.Coefficient;
				activeNode.setLeaf(leafNode);
			}
		}

		i += match.match.length;
	}

	while (activeNode.parentNode) {
		activeNode = activeNode.parentNode;
	}
	
	return activeNode;
};/**
 * The node representation of an operand, i.e., a terminus ("leaf") node 
 * representing a number, variable, or constant rather than a mathmematical operation.
 * 
 * @constructor
 * @property {number|string} value
 * @property {boolean} isNumber
 * 
 * @param {*} value
 */
function LeafNode(value) {
	'use strict';
	
	var self = this;

    // ================================================================================
    // Public Properties
    // ================================================================================

	this.value = value;
	
    // ================================================================================
    // Methods
    // ================================================================================
	
	this.isNumeric = function() {
		return String(Number(this.value)) === this.value;
	};
	

	this.print = function(parentElement) { 
		var newElement = document.createElement('div');
		newElement.className = 'node leaf-node';
		newElement.innerHTML += self.value;
		parentElement.appendChild(newElement);
	};

	this.prettyInput = function() {
		return self.value;
	};

	this.simplify = function() {
		return Number(self.value);
	};

	this.calculate = function() {
		return Number(self.value);
	};

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
};/* global Operator */
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
};
/**
 * The constructors properities for {@link Operator}.
 * 
 * @typedef {Object} OperatorProps
 * @property {RegExp} regex   the match pattern to identify an operator in an equation
 * @property {number} tightness   how tightly bound an operator is to its value, e.g., its rank in the order of operations heirchy
 * @property {Function simplify
 * @property {Function} calculate
 * @property {string} [openSymbol]
 * @property {string} [closeSymbol]
 * @property {string} [debugSymbol]
 * @property {boolean} [rightToLeft]   if {@code true}, this operator is evaluated right-to-left rather than left-to-right, as with exponenents
 */

/**
 * An Operator represents a mathmmatical function that may be performed on numbers or symbols,<br>
 * including things like multiplication, division, logarithms, and exponents.
 * 
 * @constructor
 * @extends OperatorProps
 * 
 * @param {OperatorProps} prop
 */
function Operator(prop) {
	'use strict';

	var self = this;

	// ================================================================================
	// Read-Only Properties
	// ================================================================================

	Object.defineProperty(this, 'regex', {
		get: function () {
			return prop.regex;
		}
	});

	Object.defineProperty(this, 'tightness', {
		get: function () {
			return prop.tightness;
		},
		set: function(value) {
			prop.tightness = value;
		}
	});

	Object.defineProperty(this, 'openSymbol', {
		get: function () {
			return prop.openSymbol || '';
		}
	});

	Object.defineProperty(this, 'closeSymbol', {
		get: function () {
			return prop.closeSymbol || '';
		}
	});

	Object.defineProperty(this, 'debugSymbol', {
		get: function () {
			return prop.debugSymbol || this.openSymbol + this.closeSymbol;
		}
	});

	Object.defineProperty(this, 'rightToLeft', {
		get: function () {
			return !!prop.rightToLeft;
		}
	});

	Object.defineProperty(this, 'inverse', {
		get: function () {
			return Operators[prop.inverse]; // jshint ignore:line
		}
	});

	// ================================================================================
	// Methods
	// ================================================================================

	this.isTighterThan = function (otherOperator) {
		var effectiveTightness = self.tightness - (prop.rightToLeft ? 0.5 : 0);
		return effectiveTightness > otherOperator.tightness;
	};

	this.simplify = function (a, b) {
		return prop.simplify ? prop.simplify.call(self, a, b) : this.calculate(a, b);
	};

	this.calculate = function (a, b) {
		return prop.calculate ? prop.calculate.call(self, a, b) : null;
	};

	// ================================================================================
	// Initialization
	// ================================================================================

	Object.seal(this);
};/**
 * A list of all basic operator types.
 */
var Operators = {
	
	Equals: new Operator({
		regex: /^[=]/,
		tightness: 1,
		openSymbol: '=',
		calculate: function(a, b) {
			return a === b;
		},
		simplify: function(a, b) {
			return a === b;
		}
	}),
	
	PlusMinus: new Operator({
		regex: /^\+[-−]|^±/,
		tightness: 2,
		openSymbol: '±'
	}),
	
	Addition: new Operator({
		regex: /^\+/,
		tightness: 2,
		inverse: 'Subtraction',
		openSymbol: '+',
		calculate: function (a, b) {
			return a + b;
		}
	}),
	
	Subtraction: new Operator({
		regex: /^[-−]/,
		tightness: 2,
		inverse: 'Addition',
		openSymbol: '−',
		calculate: function (a, b) {
			return a - b;
		}
	}),
	
	Multiply: new Operator({
		regex: /^[*·∙×\u22C5]/,
		tightness: 3,
		inverse: 'Division',
		openSymbol: '&sdot;',
		calculate: function (a, b) {
			return a * b;
		},
		simplify: function(a, b) {
			
		}
	}),
	Coefficient: new Operator({ 
		tightness: 4,
		inverse: 'Division',
		//openSymbol: '&sdot;',
		debugSymbol: '&sdot;',
		calculate: function (a, b) {
			return a * b;
		}
	}),
	
	Divide: new Operator({
		regex: /^[\/∕÷]/,
		tightness: 3,
		inverse: 'Multiply',
		openSymbol: '∕',
		calculate: function (a, b) {
			return a / b;
		}
	}),
	
	Exponent: new Operator({
		regex: /^\^/,
		tightness: 4,
		inverse: 'Logarithm',
		openSymbol: '<sup>',
		closeSymbol: '</sup>',
		debugSymbol: '^',
		rightToLeft: true,
		calculate: function (a, b) {
			return Math.pow(a, b);
		}
	})

};


/*
 OPERATORS TO ADD:
 
 if (match = /^pi|^π/.exec(substring)) {
 node = new Constant('pi', 'π', Math.PI);
 }
 else if (match = /^e/.exec(substring)) {
 node = new Constant('e', '<i>e</i>', Math.E);
 }
 else if (match = /^i/.exec(substring)) {
 node = new Constant('i', '<i>i</i>');
 }
 
 else if (match = /^[A-Za-z]/.exec(substring)) {
 node = new Variable(match[0]);
 }
 
 else if (match = /^log([^\s\(]+)(?=\()/.exec(substring)) {
 node = new Logarithm(match[1]);
 }
 else if (match = /^log\(([^\s\(]+)(?=,)/.exec(substring)) {
 node = new Logarithm(match[1]);
 }
 else if (match = /^log/.exec(substring)) {
 node = new Logarithm(10);
 }
 else if (match = /^ln/.exec(substring)) {
 node = new Logarithm('e');
 } 
 else if (match = /^lg/.exec(substring)) {
 node = new Logarithm(10);
 }
 else if (match = /^lb/.exec(substring)) {
 node = new Logarithm(2);
 }
 
 */;/* global Operators */
/* global LeafNode */

/**
 * 
 * @param {type} substring
 * @returns {ParseInputResult}
 */
function parseInput(substring) {
	/* jshint boss: false */
	var match = null; 
	
	if (match = /^,\s*|^\(/.exec(substring)) { // jshint ignore:line
		return new ParseInputResult(match, 'OPEN-PAREN');
	}
		
	if (match = /^\)/.exec(substring)) { // jshint ignore:line
		return new ParseInputResult(match, 'CLOSE-PAREN'); 
	}
	
	for (var opKey in Operators) {
		if (Operators.hasOwnProperty(opKey) && Operators[opKey].regex) {
			if (match = Operators[opKey].regex.exec(substring)) {  // jshint ignore:line
				return new ParseInputResult(match, Operators[opKey]);
			}

		}
	}
	
	if (match = /^[0-9]+|^[A-Za-z]/.exec(substring)) { // jshint ignore:line
		return new ParseInputResult(match, new LeafNode(match[0])); 
	}
	
	return new ParseInputResult(['1'], 'BAD_CHAR');
}

/**
 * @constructor
 * 
 * @param {Array} match
 * @param {Operator|*} type 
 */
function ParseInputResult(match, type) {
	
	/** @type {string} */
	this.match = match[0];
	
	/** @type {Operator|*} */
	this.type = type;
};(function() {
	'use strict';

	Array.prototype.peek = function() {
		return this.length ? this[this.length - 1] : false;
	};

	Object.extend = function(parent, child) {
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child; 
	};

	Object.prototype.toArray = function() {
		var self = this;
		return Object.keys(self).map(function(key) {
			return self[key];
		});
	};
	 
    /**
     * The pattern for matching parseMessage replacements, e.g. "{0}", "{1}", etc.
     *
     * @type {RegEx}
     */
    var PARSE_MSG_REGEX = /{(\d+)}/;

    /**
     * Parses through the passed String looking for place holders (i.e.: {0} ). When it finds a placeholder it
     * looks for a corresponding extra argument passed to the method. If it finds one, it replaces every
     * instance of the place holder with the String value of the passed argument. Otherwise it will remove the
     * place holder.
     *
     * @param {string} message - the message to parse.
     * @param {...Object} replacements - the items to use for replacing the place holders.
     * @returns {string} - the modified String.
     */
	String.format = function(message) {
        if (typeof message === 'string') { 
            for (var match; match = PARSE_MSG_REGEX.exec(message);) { //jshint ignore:line
                var index = parseInt(match[1]) + 1;
                var replaceVal = index < arguments.length ? arguments[index] : '';
                message = message.replace(match[0], replaceVal);
            }
        }
        return message;
    };

})();