function Operator(regex, tightness, openSymbol, closeSymbol, debugSymbol, rightToLeft) {
	'use strict';

	var self = this;

	var equation = null;

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

	this.isTighterThan = function(otherOperator) {
		var effectiveTightness = self.tightness + (rightToLeft ? .5 : 0);
		return effectiveTightness > otherOperator.tightness;
	};

	this.solve = function(a, b) {return equation ? equation.call(self, a, b) : null;}

	this._equation = function(newEquation) {
		equation = newEquation;
		return self;
	};

	Object.seal(this);
}

Operator.find = function(substring) {
	return Operators.toArray().find(function(op) {
		return op.regex && op.regex.test(substring)
	});
}

var Operators = { 

	PlusMinus: new Operator(/^\+[-−]|^±/, 2, '±'),
	Addition: new Operator(/^\+/, 2, '+')._equation(function(a, b) {return a + b;}),
	Subtraction: new Operator(/^[-−]/, 2, '−')._equation(function(a, b) {return a - b;}),

	Multiply: new Operator(/^[*·∙×\u22C5]/, 3, '&sdot;')._equation(function(a, b) {return a * b;}),
	Divide: new Operator(/^[\/∕÷]/, 3, '∕')._equation(function(a, b) {return a / b;}),

	Exponent: new Operator(/^\^/, 6, '<sup>', '</sup>', '^', true)._equation(function(a, b) {return Math.pow(a, b);}),

	Coefficient: new Operator(null, 5, '&sdot;')._equation(function(a, b) {return a * b;})
};

/*
Operator.parse = function(substring) {
	for (key in Operators) {
		if (Operators.hasOwnProperty(key)) {
			var match = Operators[key].regex.exec(substring);
			if (match) {return new OperatorNode();}
		}
	}
	return Object.keys(Operators).find(function(key) {
		return Operators[key].regex.exec()
	});
};*/