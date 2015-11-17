function Operator(regex, tightness, openSymbol, closeSymbol) {
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

	Object.seal(this);
}

Operator.find = function(substring) {
	return Operators.toArray().find(function(op) {
		return op.regex && op.regex.test(substring)
	});
}

var Operators = { 
	Addition: new Operator(/^\+/, 2, '+'),
	Parenthesis: new Operator(/^,\s*|^\(/, null, '(', ')'),
	Multiply: new Operator(/^[*·∙×\u22C5]/, 3, '&sdot;'),
	Coefficient: new Operator(null, 5, '&sdot;'),
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