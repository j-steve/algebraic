/* global Operators */
/* global LeafNode */

/**
 * 
 * @param {type} substring
 * @returns {ParseInputResult}
 */
function parseInput(substring) {
	/* jshint boss: false */
	var match = null; 
	
	if (match = /^,\s*|^\(/.exec(substring)) { // jshint ignore:line
		return new ParseInputResult(match, 'OPEN-PAREN', new ParenthesisNode);
	}
		
	if (match = /^\)/.exec(substring)) { // jshint ignore:line
		return new ParseInputResult(match, 'CLOSE-PAREN'); 
	}
	
	for (var opKey in Operators) {
		if (Operators.hasOwnProperty(opKey) && Operators[opKey].regex) {
			if (match = Operators[opKey].regex.exec(substring)) {  // jshint ignore:line
				return new ParseInputResult(match, Operators[opKey], new OperatorNode(Operators[opKey]));
			}

		}
	}
	
	if (match = /^[0-9]+|^[A-Za-z]/.exec(substring)) { // jshint ignore:line
		return new ParseInputResult(match, new LeafNode(match[0]), new LeafNode(match[0])); 
	}
	
	return new ParseInputResult(['1'], 'BAD_CHAR');
}

/**
 * @constructor
 * 
 * @param {Array} match
 * @param {Operator|*} type 
 * @param {BaseNode} node 
 */
function ParseInputResult(match, type, node) {
	
	/** @type {string} */
	this.match = match[0];
	
	/** @type {Operator|*} */
	this.type = type;
	
	/** @type {BaseNode} */
	this.node = node;
}