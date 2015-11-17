function Operator(regex, tightness, openSymbol, closeSymbol, debugSymbol) {
	'use strict';

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

	Object.seal(this);
}

Operator.find = function(substring) {
	return Operators.toArray().find(function(op) {
		return op.regex && op.regex.test(substring)
	});
}

var Operators = { 

	PlusMinus: new Operator(/^\+[-−]|^±/, 2, '±'),
	Addition: new Operator(/^\+/, 2, '+'),
	Subtraction: new Operator(/^[-−]/, 2, '−'),

	Multiply: new Operator(/^[*·∙×\u22C5]/, 3, '&sdot;'),
	Divide: new Operator(/^[\/∕÷]/, 3, '∕'),

	Exponent: new Operator(/^\^/, 4, '<sup>', '</sup>', '^'),

	Coefficient: new Operator(null, 5, '&sdot;'),

	Parenthesis: new Operator(/^,\s*|^\(/, null, '(', ')'),
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