
Array.prototype.peek = function() {
	return this.length ? this[this.length - 1] : false;
};

var LB = '?'

var Formatter = {
	'\u22C5': /[*\u2219\u2022\u00B7\u00D7\u2715\u2716\u2A09\u2A2F]/g, /* times */
	'\u2215': /\u002F/g, /* divided */
	'\u002B': /\uFF0B/g, /* plus */
	'\u2212': /\u002D\u2010\uFF0D/g, /* minus */
	' ': /[\t\n\r\v]+/g,
	'$1$2': /([^A-Za-z0-9]) | ([^A-Za-z0-9])/g,
	'%': /mod/gi,
	'?': /ln/gi,
	'?': /log/gi,
	LB: /lb/gi,
}
Formatter.format = function(target) {
	Object.keys(Formatter).forEach(function(goodChar) {
		target = target.replace(Formatter[goodChar], goodChar);
	});
	return target;
};



var CharType = {
	NONE: {regex:'', group:'EMPTY'},
	SPACE: {regex:' ', group:'EMPTY'},
	
	NUMBER: {regex:/[0-9]/, group:'VALUE'},
	STRING: {regex:/[A-Za-z]/, group:'VALUE'},
	
	EQUALS: {regex:'=', group:'OPS', opsRank:1},
	
	PLUS: {regex:'\uFF0B', group:'OPS', opsRank:2},
	MINUS: {regex:'\u2212', group:'OPS', opsRank:2},
	
	TIMES: {regex:'\u22C5', group:'OPS', opsRank:3},
	DIV: {regex:'\u2215', group:'OPS', opsRank:3},
	MOD: {regex:'%', group:'OPS', opsRank:3},
	
	EXPONENT: {regex:'^', group:'OPS', opsRank:4},
	
	PAREN: {regex:'(', group:'OPS'},
	PAREN: {regex:'(', group:'OPS'},
	
	LN: {regex:'?', group:'OPS', nextOnly:true},
	LOG: {regex:'?', group:'OPS', nextOnly:true},
	LB: {regex:LB, group:'OPS', nextOnly:true}
};
CharType.find = function(target) {
	var charTypeKey = Object.keys(CharType).find(function(key) {
		if (key === 'find') {return;}
		var regex = CharType[key].regex;
		return (typeof regex === 'string') ? regex === target : regex.test(target);
	});
	return CharType[charTypeKey] || CharType.NONE;
};

function Char(char) {
	this.type = CharType.find(char);	
	this.value = char; 
	this.getElement = function() {
		return this.value;
	};
};

function Op(charType, parentOp) {
	this.isRoot = !charType;
	this.type = charType;
	this.chars = [];
	this.node = null;
	
	this.open = function(parentNode) {
		parentNode = parentNode || parentOp.node;
		parentNode.innerHTML += '<span></span>';
		this.node = parentNode.childNodes[0];
		this.close();
		this.chars.length = 0;
		if (this.type) {this.node.innerHTML += this.type.regex;}
		return this;
	};
	
	this.close = function() {
		this.node.innerHTML += this.chars.map(function(char) {return char.getElement();}).join('');
		return this.parentOp;
	};
}

function compute(equation, formattedInput, result) {
	
	var eq = [].slice.call(Formatter.format(equation.value.trim()));
	result.innerHTML = '';
	
	//result.innerHTML = '<span></span>'; 
	
	//var currentElement = result.children[0];
	//var ops = [new Op(null, [])]; 
	var currentOp = new Op().open(result);
	for (var i = 0; i < eq.length; i++) {
		var thisChar = new Char(eq[i]);
		if (thisChar.type === CharType.SPACE) {
			if (currentOp.chars.length > 0) {currentOp.chars.peek().value += thisChar.value;}
		} else if (thisChar.type == CharType.NUMBER && currentOp.chars.peek().type === CharType.NUMBER) {
			currentOp.chars.peek().value += thisChar.value;
		} else if (thisChar.type.group === 'VALUE') {
			currentOp.chars.push(thisChar);
		} else {
			if (thisChar.type.group === 'OPS') { 
				var thisOp = new Op(thisChar.type, currentOp);
				if (currentOp.isRoot) {
					thisOp.chars = currentOp.chars;
					currentOp.chars = [];
				} else {
					if (currentOp.type.opsRank && thisOp.type.opsRank && currentOp.type.opsRank <= thisOp.type.opsRank) {
						currentOp = currentOp.close(); 
					}
				}
				currentOp = thisOp.open();
			}
		
		}
		
	}
	
	while (currentOp) {
		currentOp = currentOp.close(); 
	}
}