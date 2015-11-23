/**
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
		inverse: 'Divide',
		openSymbol: '&sdot;',
		calculate: function (a, b) {
			return a * b;
		},
		simplify: function(a, b) {
			
		}
	}),
	Coefficient: new Operator({ 
		tightness: 4,
		inverse: 'Divide',
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
	}),
	
	Root: new Operator({
		regex: null,
		tightness: 4,
		inverse: 'Exponent',
		leftNodeSymbol: '<span class="n-root">',
		openSymbol: '</span>&radic;(',
		closeSymbol: ')',
		debugSymbol: '&radic;',
		calculate: function (a, b) {
			return Math.pow(b, 1/a);
		}
	}),
	
	Logarithm: new Operator({
		regex: null,
		tightness: 4,
		inverse: 'Exponent',
		leftNodeSymbol: 'log<span class="n-log">',
		openSymbol: '</span>',
		closeSymbol: '',
		debugSymbol: 'log',
		calculate: function (a, b) {
			return Math.log(b) / Math.log(a);
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
 
 */