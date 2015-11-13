function Node(type) {
	this.type = type;
}


function Operator(searchPattern, displaySymbol, closeSymbol) {
	this.super();

	//if (displaySymbol) {searchPattern += displaySymbol;}

	

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
	Multiply: new Operator('*\u22C5', '\u22C5'),
	Divide: new Operator('/\u2215', '\u2215'),
	Plus: new Operator('+', '+'),
	Minus: new Operator('-\u2212', '\u2212'),
	Exponent: new Operator('^', '<sup>', '</sup>'),
};
Operators.all = Operators.toArray();

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