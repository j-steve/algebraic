/* global Operators, LeafNode, ParenthesisNode, AdditionNode, SubtractionNode, PlusOrMinusNode, MultiplicationNode, DivisionNode */
/* global GreaterOrEqualNode, LessOrEqualNode, LessThanNode, GreaterThanNode, EqualsNode, RealNumberNode, VariableNode */

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
 * @typedef {Object} ParseInputResult 
 * @property {number} charCount   the number of characters 'consumed' by this regex match
 * @property {BaseNode} node   the resultant type of node
 */

/** 
 * @param {type} substring
 * @returns {ParseInputResult}
 */
function parseInput(substring) {
	for (var key in NODE_REGEX) {
		if (NODE_REGEX.hasOwnProperty(key)) {
			var regex = new RegExp('^' + key);
			var match = regex.exec(substring);
			if (match) {
				return {charCount: match[0].length, node: new NODE_REGEX[key](match[0])};
			}
		}
	}
}
