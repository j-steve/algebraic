/**
 * An Operator represents a mathmmatical function that may be performed on numbers or symbols,<br>
 * including things like multiplication, division, logarithms, and exponents.
 * 
 * @param {RegExp} regex - the match pattern to identify an operator in an equation
 * @param {number} tightness - how tightly bound an operator is to its value, e.g., its rank in the order of operations heirchy
 * @param {string} [openSymbol]
 * @param {string} [closeSymbol]
 * @param {string} [debugSymbol]
 * @param {boolean} [rightToLeft] - if {@code true}, this operator is evaluated right-to-left rather than left-to-right, as with exponenents
 */
function Operator(regex, tightness, openSymbol, closeSymbol, debugSymbol, rightToLeft) {
	'use strict';

	var self = this;

	var equation = null;

    // ================================================================================
    // Read-Only Properties
    // ================================================================================

	Object.defineProperty(this, 'regex', {
		get: function() {return regex;}
	});

	Object.defineProperty(this, 'tightness', {
		get: function() {return tightness;}
	});

	Object.defineProperty(this, 'openSymbol', {
		get: function() {return openSymbol || '';}
	});

	Object.defineProperty(this, 'closeSymbol', {
		get: function() {return closeSymbol || '';}
	});

	Object.defineProperty(this, 'debugSymbol', {
		get: function() {return debugSymbol || this.openSymbol + this.closeSymbol;}
	});

	Object.defineProperty(this, 'rightToLeft', {
		get: function() {return !!rightToLeft;}
	});

    // ================================================================================
    // Methods
    // ================================================================================

	this.isTighterThan = function(otherOperator) {
		var effectiveTightness = self.tightness + (rightToLeft ? .5 : 0);
		return effectiveTightness > otherOperator.tightness;
	};

	this.solve = function(a, b) {
		return equation ? equation.call(self, a, b) : null;
	}

	this.setEquation = function(newEquation) {
		equation = newEquation;
		return self;
	};

    // ================================================================================
    // Initialization
    // ================================================================================

	Object.seal(this);
}

/**
 * Returns the {@link Operator} object represented by the (start of the) given substring, if any.
 */
Operator.find = function(substring) {
	return Operators.toArray().find(function(op) {
		return op.regex && op.regex.test(substring)
	});
}

/**
 * A list of all basic operator types.
 */
var Operators = { 

	PlusMinus: new Operator(/^\+[-−]|^±/, 2, '±'),
	Addition: new Operator(/^\+/, 2, '+').setEquation(function(a, b) {return a + b;}),
	Subtraction: new Operator(/^[-−]/, 2, '−').setEquation(function(a, b) {return a - b;}),


	Multiply: new Operator(/^[*·∙×\u22C5]/, 3, '&sdot;').setEquation(function(a, b) {return a * b;}),
	Divide: new Operator(/^[\/∕÷]/, 3, '∕').setEquation(function(a, b) {return a / b;}),

	Exponent: new Operator(/^\^/, 4, '<sup>', '</sup>', '^', true).setEquation(function(a, b) {return Math.pow(a, b);}),

	SquareRoot: new Operator(/^sqrt|^√/, 4, '√').setEquation(function(a, b) {return (a != null ? a : 1) * Math.sqrt(b);}),

	Coefficient: new Operator(null, 5, '&sdot;').setEquation(function(a, b) {return a * b;})

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

	*/