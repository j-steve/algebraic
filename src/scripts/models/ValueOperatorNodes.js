
var Leaf = {};
Leaf.parse = function(substring, lastNode) {
	var node;
	var match;
	if (match = /^pi|^π/.exec(substring)) {
		node = new Constant('pi', 'π', Math.PI);
	}
	else if (match = /^e/.exec(substring)) {
		node = new Constant('e', '<i>e</i>', Math.E);
	}
	else if (match = /^i/.exec(substring)) {
		node = new Constant('i', '<i>i</i>');
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



	else if (match = /^,\s*|^\(/.exec(substring)) {
		node = new Scope();
	}
	else if (match = /^\)/.exec(substring)) {
		node = new ScopeTerminator();
	}

	else if (match = /^sqrt|^√/.exec(substring)) {
		node = new Operator('SquareRoot', '√', null, 5);
	}



	else if (match = /^[0-9]+/.exec(substring)) {
		node = new NumericNode(match[0]);
	}
	else if (match = /^[A-Za-z]/.exec(substring)) {
		node = new Variable(match[0]);
	}

	else {
		return null;
	}

	node.charCount = match[0].length;
	return node;
};

/*
function ValueNode(value) {
	Leaf.call(this, value);
};
Object.extend(Leaf, ValueNode);

function NumericNode(displayVal) {
	ValueNode.call(this, displayVal);
	var value = Number(value);
}
Object.extend(ValueNode, NumericNode);

function Constant(name, displayVal, approxVal) {
	ValueNode.call(this, displayVal);
}
Object.extend(ValueNode, Constant);

function Variable(identifier) {
	ValueNode.call(this, identifier);
}
Object.extend(ValueNode, Variable);

function Operator(name, displaySymbol, closeSymbol, tightness) {
	this.tightness = tightness;
	this.isClosed = false;

	this.open = function() {
		return displaySymbol;
	}

	this.close = function() {
		this.isClosed = true;
		return new Node(closeSymbol);
	};
}
Object.extend(Node, Operator);

function Logarithm(base) {
	var baseNode = Node.parse(base);
	Operator.call(this, 'Logarithm', getDisplayVal(), null, 6);

	function getDisplayVal() {
		switch (String(base)) {
			case 'e': return 'ln';
			case '10': return 'lg';
			default: return 'log<sub>' + baseNode.print() + '</sub>';
		}
	}
}
Object.extend(Operator, Logarithm);


function Scope(showParenthesis) {
	Node.call(this, showParenthesis ? '(' : '');
	this.parentScope = null;
	this.nodes = [];
}
Object.extend(Node, Scope);

function ScopeTerminator() {
	Node.call(this, '');
}
Object.extend(Node, Scope);
*/