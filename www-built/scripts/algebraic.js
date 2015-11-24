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
		
		rootNode.cleanup();
		simplifyElement.className = 'treeTable';
		simplifyElement.innerHTML = rootNode.toString();
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
		console.warn([].slice(arguments).join(' '));
		prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	}
}
;/* global ParenthesisNode, OperatorNode, LeafNode, parseInput, EnclosureNode, OperatorPrefixNode */

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
			closeTilType(EnclosureNode);
			if (!activeNode) {throw new Error('Unmatched ")" detected.');}
			activeNode = activeNode.parent;
		} else if (match.node === 'COMMA') {
			closeTilType(OperatorPrefixNode);
			activeNode.nodes.shift(); // chop off the Base: THAT was the base, next is operand
			activeNode = activeNode.rightNode = new ParenthesisNode();
		} else if (match.node instanceof EnclosureNode || match.node instanceof OperatorPrefixNode) { 
			addImplicitMultiply();
			activeNode.addChild(match.node);
		} else if (match.node instanceof OperatorNode) {
			rotateForOperator(match.node); 
		} else if (match.node instanceof LeafNode) {
			addImplicitMultiply();
			{activeNode.addChild(match.node);}
		}
		if (typeof match.node !== 'string') {activeNode = match.node;}
		i += match.charCount;
	}
	 
	return getRoot(activeNode);
}

function closeTilType(nodeType) { 
	while (activeNode && !(activeNode instanceof nodeType)) {
		activeNode = activeNode.parent;
	}
}

function addImplicitMultiply() {
	if (activeNode instanceof LeafNode) {
		var implicitMultiplyNode = new CoefficientNode(); 
		rotateForOperator(implicitMultiplyNode);
		activeNode = implicitMultiplyNode;
	}
}

function rotateForOperator(newOperatorNode) {
	while (activeNodeSticksToOperator(newOperatorNode) && activeNode.parent) {
		activeNode = activeNode.parent;
	}
	activeNode.rotateLeft(newOperatorNode);
}

function activeNodeSticksToOperator(newOperatorNode) {
	if (activeNode.parent instanceof OperatorNode) {
		if (!newOperatorNode.rightToLeft && !activeNode.parent.rightToLeft) {
			return newOperatorNode.stickiness <= activeNode.parent.stickiness;
		} else {
			return newOperatorNode.stickiness < activeNode.parent.stickiness;
		}
	} else {
		return false;
	}
}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	return node;
};/* global LeafNode */

var SIDES = ['leftNode', 'rightNode'];

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
				if (value) {value.parent = self;}
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
	
	this.hasBothLeafs = function() {
		return self.leftNode instanceof LeafNode && self.rightNode instanceof LeafNode;
	};
	
	this.addChild = function(newNode) {
		var nextNode = self.nodes.length;
		if (nextNode >= SIDES.length) {
			//throw new Error('Cannot add child, already has all children.');
			this.rotateLeft(newNode);
		} else {
			self[SIDES[nextNode]] = newNode;
		}
	};
	
	this.rotateLeft = function(newNode) {
		if (self.parent) {self.replaceWith(newNode);}
		newNode.leftNode = self;
	};
	
	/**
	 * @param {BaseNode} replacementNode
	 * @param {boolean} [stealNodes=false]
	 */
	this.replaceWith = function(replacementNode, stealNodes) {
		if (!self.parent) {throw new Error('Cannot replace root node.');}
		var side = SIDES[self.parent.nodes.indexOf(self)];
		self.parent[side] = replacementNode;
		if (stealNodes) {
			replacementNode.leftNode = self.leftNode;
			replacementNode.rightNode = self.rightNode;
		}
	};
	
	this.cleanup = function() {
		self.nodes.forEach(function(node) {node.cleanup();});
		if (self.hasBothLeafs() && self.rightNode.displaySequence < self.leftNode.displaySequence) {
			var newRighty = self.leftNode;
			self.leftNode = self.rightNode;
			self.rightNode = newRighty;
		}
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
 * @extends {BaseNode}
 * @property {number|string} value
 * @property {number} displaySequence
 * 
 * @param {number|string} value
 * @param {number} displaySequence
 */
function LeafNode(value, displaySequence) {
	BaseNode.call(this);

	this.value = value; 
	this.displaySequence = displaySequence;
	this.printVals.middle = value;
}
Object.extend(BaseNode, LeafNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string|number} value   a string or string representation of a number
 */
function RealNumberNode(value) { 
	value = Number(value);
	LeafNode.call(this, value, 1);
}
Object.extend(LeafNode, RealNumberNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string} value   a letter representing the name of a variable
 */
function VariableNode(value) {
	LeafNode.call(this, value, 3);
}
Object.extend(LeafNode, VariableNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string|number} value   an HTML-formatted display text for a constant
 */
function ConstantNode(value) {
	LeafNode.call(this, value, 2);
}
Object.extend(LeafNode, ConstantNode);

ConstantNode.E = function() {return new ConstantNode('<i>e</i>');};
ConstantNode.I = function() {return new ConstantNode('<i>i</i>');};
ConstantNode.PI = function() {return new ConstantNode('&pi;');};;/* global BaseNode */ 

/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} debugSymbol 
 * @param {number} stickiness
 * @param {boolean} [rightToLeft=false]
 */
function OperatorNode(debugSymbol, stickiness, rightToLeft) { 
	BaseNode.call(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '</div>';
	
	this.stickiness = stickiness;
	
	this.rightToLeft = !!rightToLeft;
}
Object.extend(BaseNode, OperatorNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function OperatorPrefixNode() { 
	OperatorNode.apply(this, arguments);
}
Object.extend(OperatorNode, OperatorPrefixNode);;/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function AdditionNode() {
	OperatorNode.call(this, '+', 2);
}
Object.extend(OperatorNode, AdditionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function SubtractionNode() {
	OperatorNode.call(this, '&minus;', 2);
}
Object.extend(OperatorNode, SubtractionNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	OperatorNode.call(this, '&plusmn;', 2);
}
Object.extend(OperatorNode, PlusOrMinusNode);;/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ComparisonNode(debugSymbol) {
	OperatorNode.call(this, debugSymbol, 1);
}
Object.extend(OperatorNode, ComparisonNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function EqualsNode() {
	ComparisonNode.call(this, '=');
}
Object.extend(ComparisonNode, EqualsNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function GreaterThanNode() {
	ComparisonNode.call(this, '&gt;');
}
Object.extend(ComparisonNode, GreaterThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessThanNode() {
	ComparisonNode.call(this, '&lt;');
}
Object.extend(ComparisonNode, LessThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function GreaterOrEqualNode() {
	ComparisonNode.call(this, '&ge;');
}
Object.extend(ComparisonNode, GreaterOrEqualNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessOrEqualNode() {
	ComparisonNode.call(this, '&le;');
}
Object.extend(ComparisonNode, LessOrEqualNode);;/* global BaseNode, OperatorNode, LeafNode */

/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} openSymbol
 * @param {string} closeSymbol
 */
function EnclosureNode(openSymbol, closeSymbol) {
	var self = this;
	
	self.openSymbol = openSymbol || '';
	self.closeSymbol = closeSymbol || ''; 
	
	BaseNode.call(self, self.openSymbol + self.closeSymbol);
	
	self.printVals.before += self.openSymbol;
	
	self.printVals.after = self.closeSymbol + self.printVals.after;
} 
Object.extend(BaseNode, EnclosureNode);

/**
 * @constructor
 * @extends {EnclosureNode}
 */
function ParenthesisNode() { 
	var self = this;
	
	EnclosureNode.call(self, '(', ')');
	
	var baseCleanup = this.cleanup;
	this.cleanup = function() {
		baseCleanup.call(self);
		if (self.leftNode instanceof LeafNode) {
			self.replaceWith(self.leftNode);
		}
	};
}
Object.extend(EnclosureNode, ParenthesisNode);
;/* global OperatorNode, OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ExponentNode() {
	OperatorNode.call(this, '^', 4, true);
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function RootNode() {
	OperatorNode.call(this, '&radic;');
}
Object.extend(OperatorNode, RootNode); 

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 */
function LogarithmNode(base) {  
	OperatorPrefixNode.call(this, 'log', 3);
	this.leftNode = base || new RealNumberNode(10);
}
Object.extend(OperatorPrefixNode, LogarithmNode);;/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function BaseMultiplicationNode() {
	OperatorNode.apply(this, arguments);
}
Object.extend(OperatorNode, BaseMultiplicationNode);

/**
 * @constructor
 * @extends {BaseMultiplicationNode}
 */
function MultiplicationNode() {
	var self = this;
	
	BaseMultiplicationNode.call(this, '&sdot;', 3);
	 
	var baseCleanup = this.cleanup;
	this.cleanup = function() {
		if (self.hasBothLeafs()) {
			self.replaceWith(new CoefficientNode, true);
		}
	};
}
Object.extend(BaseMultiplicationNode, MultiplicationNode);

/**
 * @constructor
 * @extends {BaseMultiplicationNode}
 */
function CoefficientNode() {
	BaseMultiplicationNode.call(this, 'c', 4);
}
Object.extend(BaseMultiplicationNode, MultiplicationNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function DivisionNode() {
	OperatorNode.call(this, '∕', 3);
}
Object.extend(OperatorNode, DivisionNode);;/* global OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function SinNode() {  
	OperatorPrefixNode.call(this, 'sin', 3);
}
Object.extend(OperatorPrefixNode, SinNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function CosNode() {  
	OperatorPrefixNode.call(this, 'cos', 3);
}
Object.extend(OperatorPrefixNode, CosNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function TanNode() {  
	OperatorPrefixNode.call(this, 'tan', 3);
}
Object.extend(OperatorPrefixNode, TanNode);;/* global Operators, LeafNode, ParenthesisNode, AdditionNode, SubtractionNode, PlusOrMinusNode, MultiplicationNode, DivisionNode */
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
