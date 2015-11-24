(function() {
	'use strict';

	Array.prototype.peek = function() {
		return this.length ? this[this.length - 1] : false;
	};

	Object.extend = function(parent, child) {
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child; 
	};
	
	/*Object.iterate = function(target, callback, thisContext) {
		Object.keys(target).forEach(function(key) {
			callback.call(thisContext, target[key], key, target);
		});
	};*/

	Object.prototype.toArray = function() {
		var self = this;
		return Object.keys(self).map(function(key) {
			return self[key];
		});
	};
	 
    /**
     * The pattern for matching parseMessage replacements, e.g. "{0}", "{1}", etc.
     *
     * @type {RegEx}
     */
    var PARSE_MSG_REGEX = /{(\d+)}/;

    /**
     * Parses through the passed String looking for place holders (i.e.: {0} ). When it finds a placeholder it
     * looks for a corresponding extra argument passed to the method. If it finds one, it replaces every
     * instance of the place holder with the String value of the passed argument. Otherwise it will remove the
     * place holder.
     *
     * @param {string} message - the message to parse.
     * @param {...Object} replacements - the items to use for replacing the place holders.
     * @returns {string} - the modified String.
     */
	String.format = function(message) {
        if (typeof message === 'string') { 
            for (var match; match = PARSE_MSG_REGEX.exec(message);) { //jshint ignore:line
                var index = parseInt(match[1]) + 1;
                var replaceVal = index < arguments.length ? arguments[index] : '';
                message = message.replace(match[0], replaceVal);
            }
        }
        return message;
    };

})();;/* global makeEquationTree */

function compute(equation, treeTableElement, prettyInputElement, simplifyElement, calculateElement) {
	'use strict';

	treeTableElement.innerHTML = '';
	prettyInputElement.innerHTML = '';
	simplifyElement.innerHTML = '';
	calculateElement.innerHTML = '';

	try {
		var rootNode = makeEquationTree(equation.value);

		// Output results
		treeTableElement.innerHTML = rootNode.toString();
		return;
		//rootNode.print(treeTableElement);
		prettyInputElement.innerHTML = '<span>' + rootNode.prettyInput() + '</span>';
		rootNode.simplify();
		
		rootNode.cleanup();
		rootNode.print(simplifyElement);
		simplifyElement.className = 'treeTable';
		calculateElement.innerHTML = rootNode.calculate();
		//simplifyElement.innerHTML = rootNode.prettyInput();
	} catch (err) {
		prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	}
}
;/* global ParenthesisNode, OperatorNode, LeafNode, parseInput, EnclosureNode */

var activeNode;

/**
 * @param {string} inputEquation
 * @returns {OperatorNode}
 */
function makeEquationTree(inputEquation) { 
	activeNode = new BaseNode();
	for (var i = 0; i < inputEquation.length;) {
		var match = parseInput(inputEquation.substring(i));
		if (!match) {throw new Error(String.format('Invalid character: "{0}"', inputEquation[i]));}
		if (match.node === 'CLOSE_PAREN') {
			closeParenthesis();
		} else if (match.node instanceof EnclosureNode) { 
			addImplicitMultiply();
			activeNode.addChild(match.node);
			activeNode = match.node;
		} else if (match.node instanceof OperatorNode) { 
			activeNode.rotateLeft(match.node); 
			activeNode = match.node;
		} else if (match.node instanceof LeafNode) {
			addImplicitMultiply();
			activeNode.addChild(match.node);
			activeNode = match.node;
		}
		i += match.charCount;
	}
	 
	return getRoot(activeNode);
}

function closeParenthesis() { 
	while (!(activeNode instanceof EnclosureNode)) {
		activeNode = activeNode.parent;
	}
	if (!activeNode.parent) {throw new Error('Unmatched ")" detected.');}
	activeNode = activeNode.parent;
}

function addImplicitMultiply() {
	if (activeNode.leftNode) {
		if (activeNode.rightNode) {
			var implicitMultiplyNode = new MultiplicationNode();
			activeNode.rotateLeft(implicitMultiplyNode);
			activeNode = implicitMultiplyNode;
		}
	}
}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	return node;
};var SIDES = ['leftNode', 'rightNode'];

/**
 * @constructor
 * @param {BaseNode} parentNode
 * 
 * @property {BaseNode} parent
 * @property {Array} nodes
 * @property {BaseNode} leftNode
 * @property {BaseNode} rightNode
 */
function BaseNode(parentNode) {
	'use strict';
	var self = this;

    // ================================================================================
    // Properties
    // ================================================================================
	
	this.parent = parentNode;
	
	this.nodes = [];
	
	SIDES.forEach(function(side, index) {
		Object.defineProperty(self, side, {
			get: function() {return self.nodes[index];},
			set: function(value) {
				value.parent = self;
				self.nodes[index] = value;
			}
		});
	});
	
	this.printVals = {
		before: '<div class="node operator-node">',
		middle: '',
		after: '</div>'
	};

    // ================================================================================
    // Methods
    // ================================================================================
	
	this.addChild = function(newChild) {
		var nextNode = self.nodes.length;
		if (nextNode >= SIDES.length) {throw new Error('Cannot add child, already has all children.');}
		self[SIDES[nextNode]] = newChild;
	};
	
	this.rotateLeft = function(newNode) {
		if (self.parent) {
			var side = SIDES[self.parent.nodes.indexOf(self)];
			self.parent[side] = newNode;
		}
		newNode.leftNode = self;
	};
	
	this.toString = function() {
		var nodes = self.nodes.concat(['', '']).slice(0, 2);
		return self.printVals.before + nodes.join(self.printVals.middle) + self.printVals.after;
	};
	
}

;/* global BaseNode */

/**
 * The node representation of an operand, i.e., a terminus ("leaf") node 
 * representing a number, variable, or constant rather than a mathmematical operation.
 * 
 * @constructor
 * @property {number|string} value
 * @property {boolean} isNumber
 * 
 * @param {*} value
 */
function LeafNode(value) {
	BaseNode.call(this);

	this.value = value; 
	this.printVals.middle = value;
}
Object.extend(BaseNode, LeafNode);


function RealNumberNode(value) { 
	value = Number(value);
	LeafNode.call(this, value);
}
Object.extend(LeafNode, RealNumberNode);


function VariableNode(value) {
	LeafNode.call(this, value);
}
Object.extend(LeafNode, VariableNode);


function ConstantNode(value) {
	LeafNode.call(this, value);
}
Object.extend(LeafNode, ConstantNode);

ConstantNode.E = function() {return new ConstantNode('<i>e</i');};
ConstantNode.I = function() {return new ConstantNode('<i>e</i');};
ConstantNode.PI = function() {return new ConstantNode('&pi;');};;/* global BaseNode */ 

/**
 * @constructor
 * 
 * @param {string} debugSymbol
 * @returns {OperatorNode}
 */
function OperatorNode(debugSymbol) {
	'use strict';
	var self = this;
	
	BaseNode.call(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '</div>';
}

Object.extend(BaseNode, OperatorNode);;/* global OperatorNode */

function AdditionNode() {
	OperatorNode.call(this, '+');
}
Object.extend(OperatorNode, AdditionNode);

function SubtractionNode() {
	OperatorNode.call(this, '&minus;');
}
Object.extend(OperatorNode, SubtractionNode);

function PlusOrMinusNode() {
	OperatorNode.call(this, '&plusmn;');
}
Object.extend(OperatorNode, PlusOrMinusNode);;/* global OperatorNode */

function ComparisonNode(debugSymbol) {
	OperatorNode.call(this, debugSymbol);
}
Object.extend(OperatorNode, ComparisonNode);

function EqualsNode() {
	ComparisonNode.call(this, '=');
}
Object.extend(ComparisonNode, EqualsNode);

function GreaterThanNode() {
	ComparisonNode.call(this, '&gt;');
}
Object.extend(ComparisonNode, GreaterThanNode);

function LessThanNode() {
	ComparisonNode.call(this, '&lt;');
}
Object.extend(ComparisonNode, LessThanNode);

function GreaterOrEqualNode() {
	ComparisonNode.call(this, '&ge;');
}
Object.extend(ComparisonNode, GreaterOrEqualNode);

function LessOrEqualNode() {
	ComparisonNode.call(this, '&le;');
}
Object.extend(ComparisonNode, LessOrEqualNode);;/* global BaseNode */

function EnclosureNode(openSymbol, closeSymbol) {
	var self = this;
	
	self.openSymbol = openSymbol || '';
	self.closeSymbol = closeSymbol || ''; 
	
	BaseNode.call(self, self.openSymbol + self.closeSymbol);
	
	self.printVals.before += self.openSymbol;
	
	self.printVals.after = self.closeSymbol + self.printVals.after;
} 
Object.extend(BaseNode, EnclosureNode);

function ParenthesisNode() { 
	EnclosureNode.call(this, '(', ')');
}
Object.extend(EnclosureNode, ParenthesisNode);

function LogarithmNode(base) {  
	EnclosureNode.call(this, 'log(', ')');
	
	if (base) {this.leftNode = base;}
}
Object.extend(EnclosureNode, LogarithmNode);;/* global OperatorNode */

function ExponentNode() {
	OperatorNode.call(this, '^');
}
Object.extend(OperatorNode, ExponentNode);

function RootNode() {
	OperatorNode.call(this, '&radic;');
	Object.seal(this);
}
Object.extend(OperatorNode, RootNode); ;/* global OperatorNode */

function MultiplicationNode() {
	OperatorNode.call(this, '&sdot;');
}
Object.extend(OperatorNode, MultiplicationNode);

function DivisionNode() {
	OperatorNode.call(this, '∕');
}
Object.extend(OperatorNode, DivisionNode);;/* global Operators, LeafNode, ParenthesisNode, AdditionNode, SubtractionNode, PlusOrMinusNode, MultiplicationNode, DivisionNode */
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
