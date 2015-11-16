function Node(type) {
	this.type = type;
}


function Operator(tightness, searchPattern, displaySymbol, closeSymbol) {
	this.super();
	this.tightness = tightness;

	this.match = function(subject) {
		return searchPattern.includes(subject);
	};

	this.open = function() {
		return displaySymbol || '';
	};

	this.close = function() {
		return closeSymbol || '';
	};
}
Object.extend(Node, Operator);
Operator.match = function() {}


var Operators = {
	BinaryLog: new Operator(6, '①', 'log<sub>2</sub>'),
	NaturalLog: new Operator(6, '②', 'ln'),
	CommonLog: new Operator(6, '③', 'log<sub>10</sub>'),
	Log: new Operator(6, '④', 'log'),

	Equals: new Operator(1, '=', '='),
	Plus: new Operator(2, '+', '+'),
	Minus: new Operator(2, '-\u2212', '\u2212'),
	Multiply: new Operator(3, '*\u22C5', '\u22C5'),
	Divide: new Operator(3, '/\u2215', '\u2215'),
	Exponent: new Operator(4, '^', '<sup>', '</sup>'),
	Coefficent: new Operator(5, '×', '\u22C5')
};
Operators.all = Operators.toArray();

var NUMERIC_CHARS = /[0-9eπi]/;

function Value(type, value) {
	this.super(type);
	this.value = value;
}
Object.extend(Node, Value);

function NumberValue(type, value) {
	this.super(type, value);
}
Object.extend(Value, NumberValue);

function StringValue(type, value) {
	this.super(type, value);
}
Object.extend(Value, StringValue);