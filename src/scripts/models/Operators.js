function Operator(regex, tightness, openSymbol, closeSymbol, debugSymbol, rightToLeft) {
	'use strict';

	var self = this;

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
		return effectiveTightness > otherOperator.tightness;/*

		if (!self.tightness) {
			return true; // ops without tightness (e.g. parenthesis) are always tightest
		} else if (!otherOperator.tightness) {
			return false;
		} else {
			var effectiveTightness = self.tightness; + (rightToLeft ? .5 : 0);
			return effectiveTightness > otherOperator.tightness;
		}*/
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
	Addition: new Operator(/^\+/, 2, '+'),
	Subtraction: new Operator(/^[-−]/, 2, '−'),

	Multiply: new Operator(/^[*·∙×\u22C5]/, 3, '&sdot;'),
	Divide: new Operator(/^[\/∕÷]/, 3, '∕'),

	Exponent: new Operator(/^\^/, 6, '<sup>', '</sup>', '^', true),

	Coefficient: new Operator(null, 5, '&sdot;'),

	//Parenthesis: new Operator(/^,\s*|^\(/, null, '(', ')'),
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