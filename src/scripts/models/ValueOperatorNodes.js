function Node(type, charCount, value, displayVal) {
	this.type = type;
	this.charCount = charCount;
	this.value = value;

	this.print = function() {
		return displayVal;
	};
}

Node.parse = function(substring) {
	var match;
	if (match = /^[0-9]+/.exec(substring)) {
		return new Node('Number', match[0].length, Number(match[0]), match[0]);
	}
	else if (match = /^pi|^π/.exec(substring)) {
		return new Node('Constant', match[0].length, Math.PI, 'π');
	}
	else if (match = /^e/.exec(substring)) {
		return new Node('Constant', match[0].length, Math.E, '<i>e</i>');
	}
	else if (match = /^i/.exec(substring)) {
		return new Node('Constant', match[0].length, 'i', '<i>i</i>');
	}

	else if (match = /^log([^\s\(]+)(?=\()/.exec(substring)) {
		return new Logarithm(match[0].length, match[1]);
	}
	else if (match = /^log\(([^\s\(]+)(?=,)/.exec(substring)) {
		return new Logarithm(match[0].length, match[1]);
	}
	else if (match = /^ln/.exec(substring)) {
		return new Logarithm(match[0].length, 'e');
	} 
	else if (match = /^lg/.exec(substring)) {
		return new Logarithm(match[0].length, 10);
	}
	else if (match = /^lb/.exec(substring)) {
		return new Logarithm(match[0].length, 2);
	}

	else if (match = /^\^/.exec(substring)) {
		return new Operator('Exponent', match[0].length, '<sup>', '</sup>', 4);
	}

	else if (match = /^\+-/.exec(substring)) {
		return new Operator('PlusMinus', match[0].length, '±', null, 2);
	}
	else if (match = /^\+/.exec(substring)) {
		return new Operator('Plus', match[0].length, '+', null, 2);
	}
	else if (match = /^[-−]/.exec(substring)) {
		return new Operator('Minus', match[0].length, '−', null, 2);
	}

	else if (match = /^[*·∙×\u22C5]/.exec(substring)) {
		return new Operator('Minus', match[0].length, '&sdot;', null, 3);
	}

	else if (match = /^[A-Za-z]/.exec(substring)) {
		return new Node('Variable', match[0].length, match[0], match[0]);
	}

	else if (match = /^,\s*|^\(/.exec(substring)) {
		return new Node('Scope', match[0].length, null, '(');
	}
	else if (match = /^\)/.exec(substring)) {
		return new Node('ScopeEnd', match[0].length, null, ')');
	}

	else {
		return new Node('Unknown', 1, null, null);
	}
};

function Logarithm(charCount, base) {
	this.super('Operator', charCount, [Math.log, base], getDisplayVal());

	function getDisplayVal() {
		switch (String(base)) {
			case 'e': return 'ln';
			case '10': return 'lg';
			default: return 'log<sub>' + base + '</sub>';
		}
	}
}
Object.extend(Node, Logarithm);



function Operator(name, charCount, displaySymbol, closeSymbol, tightness) {
	this.super('Operator', charCount, null, displaySymbol);
	this.tightness = tightness;
	this.isClosed = false;

	this.close = function() {
		this.isClosed = true;
		return new Node('OperatorClose', null, null, closeSymbol || '');
	};
}
Object.extend(Node, Operator);