
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