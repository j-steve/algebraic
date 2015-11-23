/* global Operators */
/* global LeafNode */

var NODE_REGEX = {
	',\\\s*': ParenthesisNode,
	'\\\(': ParenthesisNode,
	'\\\+': AdditionNode,
	'[-−]': SubtractionNode,
	'\\\+[-−]': PlusOrMinusNode,
	'±': PlusOrMinusNode,
	'[*·∙×\u22C5]': MultiplicationNode,
	'[\/∕÷]': DivisionNode,
	
	'>=': GreaterOrEqualNode,
	'<=': LessOrEqualNode,
	'<': LessThanNode,
	'>': GreaterThanNode,
	'=': EqualsNode,
	
	'[0-9]+': RealNumberNode,
	'[A-Za-z]': VariableNode
	
};

/**
 * 
 * @param {type} substring
 * @returns {ParseInputResult}
 */
function parseInput(substring) {
	for (var key in NODE_REGEX) {
		if (NODE_REGEX.hasOwnProperty(key)) {
			var regex = new RegExp('^' + key);
			var match = regex.exec(substring);
			if (match) {
				return new ParseInputResult(match, null, NODE_REGEX[key]);
			}
		}
	}
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