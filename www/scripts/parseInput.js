/* global Operators, LeafNode, ParenthesisNode, AdditionNode, SubtractionNode, PlusOrMinusNode, MultiplicationNode, DivisionNode */
/* global GreaterOrEqualNode, LessOrEqualNode, LessThanNode, GreaterThanNode, EqualsNode, RealNumberNode, VariableNode */
/* global ExponentNode, LogarithmNode, RootNode, ConstantNode,  */
/* global */

var NODE_REGEX = {
	',': 'COMMA',
	'\\\)': 'CLOSE_PAREN',
	'\\\s': 'WHITESPACE',
	'\\\(': ParenthesisNode,
	'\\\+': AdditionNode,
	'[-−]': SubtractionNode,
	'\\\+[-−]': PlusOrMinusNode,
	'±': PlusOrMinusNode,
	'[*·∙×\u22C5]': MultiplicationNode,
	'[\/∕÷]': DivisionNode, 
	'\\\^': ExponentNode,
	'log': LogarithmNode,
	'lg': Function.bind.call(LogarithmNode, null, new RealNumberNode(2)),
	'ln': Function.bind.call(LogarithmNode, null, new ConstantNode.E),
	
	'sin': SinNode,
	'cos': CosNode,
	'tan': TanNode,
	
	'e': ConstantNode.E,
	'i': ConstantNode.I,
	'pi': ConstantNode.PI,
	
	'>=': GreaterOrEqualNode,
	'<=': LessOrEqualNode,
	'<': LessThanNode,
	'>': GreaterThanNode,
	'=': EqualsNode,
	
	'([0-9]+)': RealNumberNode,
	'([A-Za-z])': VariableNode
	
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
				var nodeType = NODE_REGEX[key];
				if (typeof nodeType !== 'string') {
					nodeType = new nodeType(match[1]);
				}
				return {charCount: match[0].length, node: nodeType};
			}
		}
	}
}
