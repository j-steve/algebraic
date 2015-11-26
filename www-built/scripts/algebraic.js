function instanceOf(target, instanceTypes) {
	if (Array.isArray(target)) {
		return target.every(function(x) {return instanceOf(x, instanceTypes);});
	} else { 
		instanceTypes = [].concat(instanceTypes || []);
		for (var i = 0; i < instanceTypes.length; i++) {
			if (target instanceof instanceTypes[i]) {return true;}
		}
		return false;
	}
}

(function() {
	'use strict';
	
	Array.prototype.remove = function() {
		var removedCount = 0;
		for (var i = 0; i < arguments.length; i++) {
			var index = this.indexOf(arguments[i]);
			while (index !== -1) {
				this.splice(index, 1);
				removedCount++;
				index = this.indexOf(arguments[i]);
			}
		}
		return removedCount;
	};

	Array.prototype.peek = function() {
		return this.length ? this[this.length - 1] : false;
	};
	
	Array.prototype.sorted = function() {
		var clone = [].slice.call(this);
		[].sort.apply(clone, arguments);
		return clone;
	};
	
	Array.combos = function(array) {
		var combos = [];
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array.length; j++) {
				if (i !== j) {
					combos.push([array[i], array[j]]);
				}
			}
		}
	};

	Object.extend = function(parent, child) {
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child;
		child.$super = function(self) {	
			parent.apply(self, [].slice.call(arguments, 1));
			var $super = {};
			for (var key in self) {
				if (self.hasOwnProperty(key)) {
					$super[key] = self[key];
				}
			}
			return $super;
		};
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

})();

/*------------------------------------------------*/
/* global LeafNode, RealNumberNode */

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
				if (typeof value === 'number') {
					value = new RealNumberNode(value);
				}
				if (value) {
					value.parent = self;
				}
				self.nodes[index] = value;
			}
		});
	});
	
	this.printVals = {
		before: '<div class="node operator-node ' + this.constructor.name + '">',
		middle: '',
		after: '</div>'
	};

    // ================================================================================
    // Methods
    // ================================================================================
	
	/**
	 * @returns {Array}
	 */
	/*this.decendants = function() {
		var children = self.nodes.slice();
		self.nodes.forEach(function(node) {
			children = children.concat(node.decendantNodes());
		});
		return children;
	};
	
	this.getNodeOfType = function(instanceType) {
		var isInstance = function(x) {return x instanceof instanceType;};
		return self.sides.find(function(side) {return side.decendants().any(isInstance);});
	};*/
	
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
	 * Returns the string name of the side of the parentNode on which this node appears.
	 * 
	 * @returns {string}   either "leftNode" or "rightNode"
	 */
	this.side = function() { 
		return SIDES[self.parent.nodes.indexOf(self)];
	};
	
	/**
	 * @param {BaseNode} replacementNode
	 * @param {boolean} [stealNodes=false]
	 */
	this.replaceWith = function(replacementNode, stealNodes) {
		if (!self.parent) {throw new Error('Cannot replace root node.');}
		var side = self.side();
		var parent = self.parent;
		if (replacementNode && replacementNode.parent) { 
			replacementNode.parent[replacementNode.side()] = self;
		}
		parent[side] = replacementNode;
		if (stealNodes) {  
			replacementNode.leftNode = self.leftNode;
			replacementNode.rightNode = self.rightNode;
		}
	};
	 
	this.cleanup = function() { 
		self.nodes.forEach(function(node) {
			node.cleanup();
			if (node.leftNode && !node.rightNode) {
				node.replaceWith(node.leftNode); 
			}
		}); 
	};
	
	this.simplify = function() {
		self.nodes.forEach(function(node) {node.simplify();});
	};
	
	this.equals = function(other) {
		if (!other || self.constructor !== other.constructor) {return false;}
		for (var i = 0; i < self.nodes.length; i++) {
			if (!self.nodes[i].equals(other.nodes[i])) {return false;}
		}
		return true;
	};
	
	this.toString = function() {
		var result = self.printVals.before; 
		if (self.leftNode) {result += '<span class="leftNode">' + self.leftNode + '</span>';}
		result += self.printVals.middle;
		if (self.rightNode) {result += '<span class="rightNode">' + self.rightNode + '</span>';}
		return result + self.printVals.after;
	};
	
}



/*------------------------------------------------*/
/* global BaseNode */ 

/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} debugSymbol 
 * @param {number} stickiness
 * @param {boolean} [rightToLeft=false]
 */
function OperatorNode(debugSymbol, stickiness, rightToLeft) { 
	OperatorNode.$super(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '</div>';
	
	this.stickiness = stickiness;
	
	this.rightToLeft = !!rightToLeft;
}
Object.extend(BaseNode, OperatorNode);

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} debugSymbol 
 * @param {number} stickiness
 * @param {boolean} [rightToLeft=false]
 */
function OperatorPrefixNode(debugSymbol, stickiness, rightToLeft) { 
	OperatorPrefixNode.$super(this, debugSymbol, stickiness, rightToLeft);
}
Object.extend(OperatorNode, OperatorPrefixNode);

/*------------------------------------------------*/
/* global OperatorNode, LeafNode, SIDES */


Object.extend(OperatorNode, CommutativeOpNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} debugSymbol
 * @param {number} stickinesss
 * @param {Function} opInstanceType
 * @param {Function} operatorFunction
 */
function CommutativeOpNode(debugSymbol, stickinesss, opInstanceType, operatorFunction) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, debugSymbol, stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
		
		var leafsInScope = self.getLeafsInScope().filter(function(x) {return x instanceof LeafNode;});
		var sortedLeafs = leafsInScope.sorted(function(a, b) {return a.displaySequence - b.displaySequence || a.value > b.value;});
		for (var i = 0; i < sortedLeafs.length - 1; i++) {
			var leaf = sortedLeafs[i];
			if (leaf !== leafsInScope[i]) { 
				leaf.replaceWith(leafsInScope[i]);
				leafsInScope[leafsInScope.indexOf(leaf)] = leafsInScope[i];
				leafsInScope[i] = leaf;
			}
		}
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var leafsInScope = self.getLeafsInScope();
		//var checkNodes = self.nodes.slice(); 
		 
		nodes: for (var i = 0; i < SIDES.length; i++) { 
			var side = SIDES[i];
			var node = self[side];
			for (var j = 0; j < leafsInScope.length; j++) {
				var otherNode = leafsInScope[j];
				if (otherNode !== node) { 
					var opResult = operatorFunction.call(null, node, otherNode);
					if (opResult) {
						opResult.simplify();
						if (otherNode.parent === self) {
							self.replaceWith(opResult);
							return;
						}
						self[side] = opResult;
						var otherNodeSister = otherNode.parent.nodes.find(function(x) {return x !== otherNode;});
						otherNode.parent.replaceWith(otherNodeSister);
						leafsInScope.remove(node, otherNode);
						leafsInScope.push(opResult);
						i--;
						continue nodes;
					}
				}
			}
		}
	};
	
	this.getLeafsInScope = function() {
		var leafs = [];
		var stack = self.nodes.slice();
		while (stack.length) {
			var node = stack.shift();
			if (node instanceof LeafNode) {
				leafs.push(node);
			} else if (node instanceof opInstanceType) {
				stack = node.nodes.concat(stack);
			} else {
				leafs.push(node);
			}
		}
		return leafs;
	};
}

/*------------------------------------------------*/
/* global BaseNode */

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
	var self = this;
	var $super = LeafNode.$super(this);

	this.value = value; 
	this.displaySequence = displaySequence;
	
	this.toString = function() {
		return self.value;
	};
	
	this.equals = function(other) {
		return $super.equals(other) && self.value === other.value;
	};
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
	RealNumberNode.$super(this, value, 1);
}
Object.extend(LeafNode, RealNumberNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string} value   a letter representing the name of a variable
 */
function VariableNode(value) {
	VariableNode.$super(this, value, 3);
}
Object.extend(LeafNode, VariableNode);

/**
 * @constructor
 * @extends {LeafNode}
 * 
 * @param {string|number} value   an HTML-formatted display text for a constant
 */
function ConstantNode(value) {
	ConstantNode.$super(this, value, 2);
}
Object.extend(LeafNode, ConstantNode);

ConstantNode.E = function() {return new ConstantNode('<i>e</i>');};
ConstantNode.I = function() {return new ConstantNode('<i>i</i>');};
ConstantNode.PI = function() {return new ConstantNode('&pi;');};

/*------------------------------------------------*/
/* global makeEquationTree */

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
		
		prettyInputElement.className = 'formatted';
		prettyInputElement.innerHTML = rootNode.toString(); 
		
		rootNode.cleanup();
		rootNode.simplify();
		simplifyElement.className = 'treeTable';
		simplifyElement.innerHTML = rootNode.toString();
		
		calculateElement.className = 'formatted result';
		calculateElement.innerHTML = rootNode.toString();
		
	} catch (err) {
		console.warn([].slice(arguments).join(' '));
		prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	}
}


/*------------------------------------------------*/
/* global ParenthesisNode, OperatorNode, LeafNode, parseInput, EnclosureNode, OperatorPrefixNode */

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
		var implicitMultiplyNode = new MultiplicationNode(); 
		implicitMultiplyNode.tightness += 1;
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
}

/*------------------------------------------------*/
/* global OperatorNode, RealNumberNode, LeafNode, SIDES, MultiplicationNode, CommutativeOpNode */

/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function AdditionNode(leftNode, rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2, AdditionNode, add);
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
		
		if (self.leftNode instanceof LeafNode && self.rightNode instanceof MultiplicationNode) {
			self.leftNode.replaceWith(self.rightNode);
		}
	};
	
	function add(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value + b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new MultiplicationNode(2, a);
			
		} else if (a instanceof MultiplicationNode && a.rightNode instanceof VariableNode) {
			if (a.rightNode.equals(b)) {
				var newAdd = new AdditionNode(a.leftNode, 1);
				return new MultiplicationNode(newAdd, a.rightNode); 
			} else if (a.rightNode.equals(b.rightNode)) { 
				var newAdd = new AdditionNode(a.leftNode, b.leftNode);
				return new MultiplicationNode(newAdd, a.rightNode);
			}
		}
	}
}
Object.extend(CommutativeOpNode, AdditionNode);


Object.extend(OperatorNode, SubtractionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 */
function SubtractionNode() {
	SubtractionNode.$super(this, '&minus;', 2);
}


Object.extend(OperatorNode, PlusOrMinusNode);
/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	PlusOrMinusNode.$super(this, '&plusmn;', 2);
}

/*------------------------------------------------*/
/* global OperatorNode */

/**
 * @constructor
 * @extends {OperatorNode}
 */
function ComparisonNode(debugSymbol) {
	var self = this;
	var $super = ComparisonNode.$super(this, debugSymbol, 1);
	
	this.cleanup = function() {
		$super.cleanup();
		/*while (self.leftNode instanceof OperatorNode) {
			var variable = lefty.leftNode.getNodeOfType(VariableNode);
			var coefficient = self.leftNode.getNodeOfType(RealNumberNode);
			var leftNodes = self.leftNode.decendants();
			if (leftNodes.any(function(node) {return node instanceof VariableNode;}))
		}*/
	};
}
Object.extend(OperatorNode, ComparisonNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function EqualsNode() {
	EqualsNode.$super(this, '=');
}
Object.extend(ComparisonNode, EqualsNode);

/**
 * @constructor 
 * @extends {ComparisonNode}
 */
function GreaterThanNode() {
	GreaterThanNode.$super(this, '&gt;');
}
Object.extend(ComparisonNode, GreaterThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessThanNode() {
	LessThanNode.$super(this, '&lt;');
}
Object.extend(ComparisonNode, LessThanNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function GreaterOrEqualNode() {
	GreaterOrEqualNode.$super(this, '&ge;');
}
Object.extend(ComparisonNode, GreaterOrEqualNode);

/**
 * @constructor
 * @extends {ComparisonNode}
 */
function LessOrEqualNode() {
	LessOrEqualNode.$super(this, '&le;');
}
Object.extend(ComparisonNode, LessOrEqualNode);

/*------------------------------------------------*/
/* global BaseNode, OperatorNode, LeafNode */

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
	
	EnclosureNode.$super(self, self.openSymbol + self.closeSymbol);
	
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
	var $super = ParenthesisNode.$super(self, '(', ')');
	
	this.cleanup = function() {
		$super.cleanup();
		if (self.leftNode instanceof LeafNode) {
			self.replaceWith(self.leftNode);
		}
	};
}
Object.extend(EnclosureNode, ParenthesisNode);


/*------------------------------------------------*/
/* global OperatorNode, OperatorPrefixNode, RealNumberNode */

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function ExponentNode(leftNode, rightNode) {
	var self = this;
	var $super = ExponentNode.$super(this, '^', 4, true);
	
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	delete leftNode, rightNode;
	
	this.simplify = function() {
		$super.simplify();
		if (instanceOf(self.nodes, RealNumberNode)) {
			var result = Math.pow(self.leftNode.value, self.rightNode.value);
			self.replaceWith(new RealNumberNode(result));
		}
	};
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function RootNode() {
	RootNode.$super(this, '&radic;');
}
Object.extend(OperatorNode, RootNode); 

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 */
function LogarithmNode(base) {  
	var self = this;
	var $super = LogarithmNode.$super(this, 'log', 3);
	this.leftNode = base || new RealNumberNode(10);
	
	this.cleanup = function() {
		$super.cleanup();
		if (!self.rightNode) {self.replaceWith(null);}
	};
	
	this.simplify = function() {
		$super.simplify();
		/*if (instanceOf(self.nodes, RealNumberNode)) {
			var result = Math.log(self.rightNode.value) / Math.log(self.leftNode.value);
			self.replaceWith(new RealNumberNode(result));
		}*/
	};
}
Object.extend(OperatorPrefixNode, LogarithmNode);

/*------------------------------------------------*/
/* global CommutativeOpNode, OperatorNode, LeafNode, RealNumberNode, ExponentNode, LogarithmNode, SIDES */

Object.extend(CommutativeOpNode, MultiplicationNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {BaseNode} leftNode
 * @param {BaseNode} rightNode
 */
function MultiplicationNode(leftNode, rightNode) {
	var self = this;
	var $super = MultiplicationNode.$super(this, '&sdot;', 3, MultiplicationNode, multiply);
	
	if (leftNode) {this.leftNode = leftNode;}
	if (rightNode) {this.rightNode = rightNode;}
	delete leftNode, rightNode;
	
	function multiply(a, b) { 
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			return new RealNumberNode(a.value * b.value);
			
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new ExponentNode(a, 2);
			
		} else if (a instanceof ExponentNode && a.leftNode.equals(b)) {
			var rightNode = new AdditionNode(a.rightNode, 1);
			return new ExponentNode(a.leftNode, rightNode);
			
		} else if (b instanceof ExponentNode && b.leftNode.equals(a)) {
			var rightNode = new AdditionNode(b.rightNode, 1);
			return new ExponentNode(b.leftNode, rightNode);
		
		} else if (a instanceof ExponentNode && b instanceof ExponentNode && a.leftNode.equals(b.leftNode)) {
			var rightNode = new AdditionNode(a.rightNode, b.rightNode);
			return new ExponentNode(a.leftNode, rightNode);
		}
	}
	
	this.isCoefficient = function() {
		for (var i = 0; i < SIDES.length; i++) { 
			var node = self[SIDES[i]];
			if (!(node instanceof LeafNode || node instanceof ExponentNode && node.leftNode instanceof LeafNode ||
					node instanceof MultiplicationNode && node.isCoefficient())) {
				return false;
			}
		}
		return true;
	};
	
	this.toString = function() {
		if (self.isCoefficient()) {
			self.printVals.before = self.printVals.before.replace('node', 'node coefficient');
		} 
		return $super.toString();
	}; 
}


Object.extend(OperatorNode, DivisionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 */
function DivisionNode() {
	var self = this; 
	var $super = DivisionNode.$super(this, '∕', 3);
	
	this.simplify = function() {
		$super.simplify(); 
		if (self.hasBothLeafs()) {
			var gcd = commonDenominator(self.leftNode.value, self.rightNode.value);
			if (gcd) {
				self.leftNode.value = self.leftNode.value / gcd;
				self.rightNode.value = self.rightNode.value / gcd;
			}
			if (self.rightNode.value === 1) {
				self.replaceWith(self.leftNode);
			}
		}
		/*if (self.rightNode instanceof RealNumberNode && self.leftNode.value !== 1) {
			var oneOver = new DivisionNode;
			oneOver.leftNode = new RealNumberNode(1);
			oneOver.rightNode = self.rightNode;
			self.rightNode = oneOver;
			self.replaceWith(new MultiplicationNode, true);
		}*/
	};
}

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}

/*------------------------------------------------*/
/* global OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function SinNode() {  
	SinNode.$super(this, 'sin', 3);
}
Object.extend(OperatorPrefixNode, SinNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function CosNode() {  
	CosNode.$super(this, 'cos', 3);
}
Object.extend(OperatorPrefixNode, CosNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function TanNode() {  
	TanNode.$super(this, 'tan', 3);
}
Object.extend(OperatorPrefixNode, TanNode);

/*------------------------------------------------*/
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
