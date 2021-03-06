'use strict';


// ====================================================================================================
//      ../polyfill.js
// ====================================================================================================

var JS_NATIVE_OBJECTS = [Date, RegExp, Function, String, Number, Boolean];

function clone(cloneFrom) {
	if (cloneFrom == null || typeof cloneFrom !== "object") {  //jshint ignore:line
		return cloneFrom;
	} else if (Array.isArray(cloneFrom)) {
		return cloneFrom.map(function(x) {return clone(x);});
	} else if (JS_NATIVE_OBJECTS.indexOf(cloneFrom.constructor) !== -1) {
        return new cloneFrom.constructor(cloneFrom);
	} else {
		var result = Object.create(cloneFrom.constructor.prototype);
		//result.constructor = cloneFrom.constructor;
		for (var prop in cloneFrom) {
			result[prop] = clone(cloneFrom[prop]);
		}
		return result;
	}
}

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
	
	if (!Array.prototype.includes) {
		Array.prototype.includes = function(value) {
			return this.indexOf(value) !== -1;
		};
	}
	
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
	
	Array.combos = function(a, b) {
		var combos = [];
		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < b.length; j++) { 
				combos.push([a[i], b[j]]); 
			}
		}
		return combos;
	};
	/*Array.combos = function(array) {
		var combos = [];
		for (var i = 0; i < array.length - 1; i++) {
			for (var j = i + 1; j < array.length; j++) { 
				combos.push([array[i], array[j]]); 
			}
		}
		return combos;
	};*/

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


// ====================================================================================================
//      ../nodes/BaseNode.js
// ====================================================================================================

var SIDES = ['leftNode', 'rightNode'];

/**
 * @constructor
 * 
 * @property {Array} nodes
 * @property {BaseNode} leftNode
 * @property {BaseNode} rightNode
 */
function BaseNode() {
	var self = this;

    // ================================================================================
    // Properties
    // ================================================================================
	
	this.nodes = [];
	
	this.miniminumNodes = 0;
	
	SIDES.forEach(function(side, index) {
		Object.defineProperty(self, side, {
			get: function() {return self.nodes[index];},
			set: function(value) {
				if (typeof value === 'number') {
					value = new RealNumberNode(value);
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
	this.decendants = function() {
		var children = self.nodes.slice();
		self.nodes.forEach(function(node) {
			children = children.concat(node.decendants());
		});
		return children;
	};
	
	/**
	 * @param {BaseNode} oldNode
	 * @param {BaseNode} newNode
	 */
	this.rotateLeft = function(oldNode, newNode) {
		self.replace(oldNode, newNode);
		newNode.nodes.unshift(oldNode);
	};
	
	/**
	 * @param {BaseNode} oldNode
	 * @param {BaseNode} newNode
	 */
	this.rotateRight = function(oldNode, newNode) {
		self.replace(oldNode, newNode);
		newNode.nodes.push(oldNode);
	};
	
	/**
	 * @param {BaseNode} oldNode
	 * @param {BaseNode} newNode
	 * @returns {BaseNode} the newNode object
	 */
	this.replace = function(oldNode, newNode) {
		var i = self.nodes.indexOf(oldNode);
		if (i === -1) {throw new Error('Does not contain oldnode.');}
		if (newNode) {self.nodes.splice(i, 1, newNode);} else {self.nodes.splice(i, 1);}
		return newNode;
	};
	
	this.cleanup = function() { 
		self.nodes.forEach(function(child) {
			child.cleanup();
		});
	};
	
	this.simplify = function() {
		self.nodes.forEach(function(x) {
			var replacementNode = x.simplify();
			if (replacementNode) {
				self.replace(x, replacementNode);
			} else if (x.nodes.length < x.minimumNodes) {
				self.replace(x, x.leftNode);
			}
		});
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
		var nodes = self.nodes.slice(1);
		while (nodes.length) { 
			result += self.printVals.middle;
			result += '<span class="rightNode">' + nodes.shift() + '</span>';
		}
		return result + self.printVals.after;
	};
	
}

Object.extend(BaseNode, TreeRootNode);
/**
 * @constructor
 * @extends {BaseNode}
 */
function TreeRootNode() {
	var $super = TreeRootNode.$super(this);
}


// ====================================================================================================
//      ../nodes/OperatorNode.js
// ====================================================================================================

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
	
	this.minimumNodes = 2;
	
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
	
	this.minimumNodes = 1; 
}
Object.extend(OperatorNode, OperatorPrefixNode);


// ====================================================================================================
//      ../nodes/operators/CommutativeOpNode.js
// ====================================================================================================

Object.extend(OperatorNode, CommutativeOpNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} _debugSymbol
 * @param {number} _stickinesss
 * @param {number} identityNumber   the identity number, which may be discarded as it does not change the equation
 * @param {Array} opSortSequence
 * @param {Function} operate
 */
function CommutativeOpNode(_debugSymbol, _stickinesss, identityNumber, opSortSequence, operate, printSymbol) {
	var self = this;
	var $super = CommutativeOpNode.$super(this, _debugSymbol, _stickinesss);
	
	this.cleanup = function() { 
		$super.cleanup();
		self.nodes.sort(opSortSequence);
	};
	
	this.simplify = function() {
		$super.simplify();
		self.nodes = self.nodes.filter(function(n) {return !n.equals(identityNumber);}); 
		
		for (var i = 1; i <= self.nodes.length; i++) {
			var a = self.nodes[self.nodes.length - i];
			for (var j = self.nodes.length - 1; j >= 0; j--) {
				var b = self.nodes[j];
				if (a !== b) {
					var result = operate(a, b);
					if (result) {
						result = result.simplify() || result;
						self.replace(b, null);
						self.replace(a, result);
						a = result;
					}
				}
			}
		}
	};
	
	
	this.toString = function() {
		var result = self.printVals.before; 
		if (self.leftNode) {result += '<span class="leftNode">' + self.leftNode + '</span>';}
		for (var i = 1; i < self.nodes.length; i++) { 
			result += printSymbol(self.nodes[i], self.nodes[i-1]) || self.printVals.middle;
			result += '<span class="rightNode">' + self.nodes[i] + '</span>';
		}
		return result + self.printVals.after;
	};
}


// ====================================================================================================
//      ../nodes/LeafNode.js
// ====================================================================================================

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
	
	
	/**
	 * LeafNodes are never obsolete, so override the function to return itself everytime
	 * to prevent the LeafNode from being removed from the heirchy (since LeafNodes have no child nodes).
	 * 
	 * @returns {LeafNode}
	 */
	this.removeIfObsolete = function() {
		return self;
	};
	
	this.toString = function() {
		return self.value;
	};
	
	this.equals = function(other) {
		return self.value === other || $super.equals(other) && self.value === other.value;
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
	var self = this;
	var $super = RealNumberNode.$super(this, Number(value), 1);
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


// ====================================================================================================
//      ../EquationTree.js
// ====================================================================================================

/**
 * @constructor 
 * 
 * @param {string} inputEquation
 */
function EquationTree(inputEquation) {
	
	/** @type {Array} */
	var nodeStack = [];
	
	Object.defineProperty(this, 'root', {get: function() {return nodeStack[0];}});

	function parse() { 
		nodeStack = [new TreeRootNode()];
		for (var i = 0; i < inputEquation.length;) {
			var match = parseNextNode(inputEquation.substring(i));
			if (!match) {
				//throw new Error(String.format('Invalid character: "{0}"', inputEquation[i]));
				i+= 1;
				continue;
			}
			if (match.node === 'CLOSE_PAREN') {
				closeTilType(EnclosureNode);
				if (!nodeStack.length) {throw new Error('Unmatched ")" detected.');}
				nodeStack.pop();
			} else if (match.node === 'COMMA') {
				closeTilType(EnclosureNode);
				nodeStack.peek().nodes.shift(); // chop off the Base: THAT was the base, next is operand
				var parenthesis = new ParenthesisNode();
				nodeStack.peek().rightNode = parenthesis;
				nodeStack.push(parenthesis);
			} else if (match.node instanceof NegativeNode) {	
				if (nodeStack.peek() instanceof LeafNode) {
					var implicitAddNode = new AdditionNode(); 
					rotateForOperator(implicitAddNode);
					nodeStack.push(implicitAddNode); 
				}
				addChildNode(match.node);
			} else if (match.node instanceof EnclosureNode || match.node instanceof OperatorPrefixNode) { 
				addChildNode(match.node);
			} else if (match.node instanceof OperatorNode) {
				rotateForOperator(match.node); 
			} else if (match.node instanceof LeafNode) {
				addChildNode(match.node);
			}
			if (typeof match.node !== 'string') {
				nodeStack.push(match.node);
			}
			i += match.charCount;
		} 

		finalize(nodeStack[0]);
		return nodeStack[0];
	}
	
	function addChildNode(newNode) {
		addImplicitMultiply();
		nodeStack.peek().nodes.push(newNode);
	}

	function closeTilType(nodeType) { 
		while (nodeStack.length && !instanceOf(nodeStack.peek(), nodeType)) {
			nodeStack.pop();
		}
	}

	function addImplicitMultiply() {
		if (nodeStack.peek() instanceof LeafNode) {
			var implicitMultiplyNode = new MultiplicationNode(); 
			implicitMultiplyNode.stickiness += 1;
			rotateForOperator(implicitMultiplyNode);
			nodeStack.push(implicitMultiplyNode);
		}
	}

	function rotateForOperator(newOperatorNode) {
		while (activeNodeSticksToOperator(newOperatorNode) && parentOfLatest()) {
			nodeStack.pop();
		}
		if (nodeStack.peek() instanceof TreeRootNode) {
			nodeStack.push(nodeStack.peek().leftNode);
		}
		var oldOp = nodeStack.pop();
		nodeStack.peek().rotateLeft(oldOp, newOperatorNode);
	}

	function activeNodeSticksToOperator(newOperatorNode) {  
		if (parentOfLatest() instanceof OperatorNode) {
			if (!newOperatorNode.rightToLeft && !parentOfLatest().rightToLeft) {
				return newOperatorNode.stickiness <= parentOfLatest().stickiness;
			} else {
				return newOperatorNode.stickiness < parentOfLatest().stickiness;
			}
		} else {
			return false;
		}
	}
	
	function parentOfLatest() {
		return nodeStack[nodeStack.length - 2]; 
	} 
	
	function finalize(node) { 
		if (node instanceof CommutativeOpNode) {setNodesInScope(node);}
		
		node.nodes.forEach(function(n) {
			finalize(n);
			if (n.nodes.length < n.minimumNodes) {
				node.replace(n, n.leftNode); // replace with any existing child, or remove if no children
			}
		}); 
	}
	
	function setNodesInScope(target) { 
		var nodeStack = target.nodes.splice(0);
		while (nodeStack.length) {
			var node = nodeStack.shift();
			if (node instanceof target.constructor) {
				nodeStack = node.nodes.concat(nodeStack);
			} else {
				target.nodes.push(node);
			}
		} 
	}
	
	return parse();
}


// ====================================================================================================
//      ../compute.js
// ====================================================================================================

/*
 * TODO: make these work:
 *	->	(4+2)/4
 *	->	543/2x+3=100
 *	->	5/4*2
 */

function compute(equation, treeTableElement, prettyInputElement, simplifyElement, calculateElement) {
	treeTableElement.innerHTML = '';
	prettyInputElement.innerHTML = '';
	simplifyElement.innerHTML = '';
	calculateElement.innerHTML = '';

	//try {
		var rootNode = new EquationTree(equation.value);

		// Output results
		treeTableElement.innerHTML = rootNode.toString();
		
		prettyInputElement.className = 'formatted';
		prettyInputElement.innerHTML = rootNode.toString(); 
		
		rootNode.simplify();
		rootNode.cleanup(); 
		
		simplifyElement.className = 'treeTable';
		simplifyElement.innerHTML = rootNode.toString();
		
		calculateElement.className = 'formatted result';
		calculateElement.innerHTML = rootNode.toString();
		
	//} catch (err) {
		//console.warn([].slice(arguments).join(' '));
		//prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	//}
}


// ====================================================================================================
//      ../nodes/operators/Addition.js
// ====================================================================================================

//TODO: -4*-4/2x+4-2-2 -> 8/x + 0

Object.extend(CommutativeOpNode, AdditionNode);
/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function AdditionNode(_leftNode, _rightNode) {
	var self = this;
	var $super = AdditionNode.$super(this, '+', 2, 0, sortNodes, add, printSymbol);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() { 
		$super.cleanup();
	};
	
	function sortNodes(a, b) {
		if (a instanceof MultiplicationNode && a.rightNode instanceof ExponentNode) {a = a.rightNode;}
		if (b instanceof MultiplicationNode && b.rightNode instanceof ExponentNode) {b = b.rightNode;}
		
		if (instanceOf([a, b], ExponentNode) && instanceOf([a.power, b.power], RealNumberNode)) {
			return b.power.value - a.power.value;
		} else {
			var OP_SEQ = [ExponentNode, MultiplicationNode, VariableNode, RealNumberNode, ConstantNode];
			var aIndex = OP_SEQ.indexOf(a.constructor), bIndex = OP_SEQ.indexOf(b.constructor);
			if (aIndex > -1 && bIndex > -1) {return aIndex - bIndex;}
		}
	}
	
	function add(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			a.value += b.value;
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new MultiplicationNode(2, a);
		} else if (a instanceof MultiplicationNode && a.rightNode.equals(b)) {
			a.leftNode = new AdditionNode(a.leftNode, 1);
		} else if (a instanceof MultiplicationNode && b instanceof MultiplicationNode && sameFactors(a, b)) {
			a.leftNode = new AdditionNode(a.leftNode, b.leftNode);
		} else {
			return null;
		}
		return a; 
	}
	
	function sameFactors(a, b) {
		if (!instanceOf([a.leftNode, b.leftNode], RealNumberNode)) {return false;}
		
		var aFactors = a.nodes.slice(1);
		var bFactors = b.nodes.slice(1);
		for (var i = 0; i < aFactors.length; i++) {
			var aNode = aFactors[i];
			var bNode = bFactors.find(function(x) {return aNode.equals(x);});
			if (!bNode) {return false;}
			var bIndex = bFactors.indexOf(bNode);
			bFactors.splice(bIndex, 1);
		}
		return true;
	}
		
	/** 
	 * @param {BaseNode} nextNode 
	 * @returns {string}
	 */
	function printSymbol(nextNode) { 
		if (nextNode instanceof NegativeNode || nextNode instanceof RealNumberNode && nextNode.value < 0) {
			return '<span class="operator minus"></span>';
		}
	}
}

Object.extend(OperatorNode, PlusOrMinusNode);
/**
 * @constructor
 * @extends {OperatorNode}
 */
function PlusOrMinusNode() {
	PlusOrMinusNode.$super(this, '&plusmn;', 2);
}


// ====================================================================================================
//      ../nodes/operators/Comparison.js
// ====================================================================================================

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} _debugSymbol
 */
function ComparisonNode(_debugSymbol) {
	var self = this;
	var $super = ComparisonNode.$super(this, _debugSymbol, 1);
	
	this.simplify = function() {
		$super.simplify();
		
		replaceParens();
		var varSide = getSideWithVar(self);
		var noVarSide = getSideWithoutVar(self);

		while (noVarSide && varSide instanceof OperatorNode) { 
			
			if (varSide instanceof NegativeNode) {
				self.rotateLeft(noVarSide, new NegativeNode());
				self.replace(varSide, varSide.leftNode);
			
			} else {
				var partToSwap = getSideWithoutVar(varSide);
				var partToKeep = getSideWithVar(varSide);
				if (!partToSwap || !partToKeep) {break;}

				if (varSide instanceof AdditionNode) {
					var addNegative = new AdditionNode(new NegativeNode(partToSwap));
					self.rotateLeft(noVarSide, addNegative);

				} else if (varSide instanceof MultiplicationNode) {
					self.rotateLeft(noVarSide, new DivisionNode(partToSwap));

				} else if (varSide instanceof DivisionNode) {
					if (partToSwap === varSide.denominator) { 
						self.rotateLeft(noVarSide, new MultiplicationNode(partToSwap));
					} else { // x is the denominator, e.g. "2/x", so multiply other side by x to solve.
						self.rotateLeft(noVarSide, new MultiplicationNode(partToKeep));
						partToKeep = partToSwap;
					} 

				} else if (varSide instanceof ExponentNode) {
					if (partToSwap === varSide.rightNode) { 
						self.rotateRight(noVarSide, new NthRootNode(partToSwap));
					} else { // x is the exponent, e.g., 2^x
						self.rotateRight(noVarSide, new LogarithmNode(partToSwap)); 
					}

				} else {
					alert('breakin up is hard');
					break;
				}
				self.replace(varSide, partToKeep, false);
			}
			
			replaceParens();
			varSide = getSideWithVar(self);
			noVarSide = getSideWithoutVar(self);
		}
		 
		if (varSide === self.rightNode && noVarSide === self.leftNode) {
			self.leftNode = varSide;
			self.rightNode = noVarSide;
		}
		
		self.leftNode = self.leftNode.simplify() || self.leftNode;
		self.rightNode = self.rightNode.simplify() || self.rightNode; 
	};
	
	
	var hasVariable = function(x) {return x instanceof VariableNode;};
	
	function getSideWithVar(node) { 
		return node.nodes.find(function(node) {
			return hasVariable(node) || node.decendants().some(hasVariable);
		});
	}
	
	function getSideWithoutVar(node) {
		return node.nodes.find(function(node) {
			return !hasVariable(node) && !node.decendants().some(hasVariable);
		});
	}
	
	function replaceParens() {
		self.nodes.forEach(function(n) {
			if (n instanceof ParenthesisNode) {
				self.replace(n, n.leftNode);
			}
		});
	}
	
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


// ====================================================================================================
//      ../nodes/operators/Division.js
// ====================================================================================================

Object.extend(OperatorNode, DivisionNode);
/**
 * @constructor
 * @extends {OperatorNode}
 * @property {BaseNode} numerator   synonym for leftNode
 * @property {BaseNode} denominator   synonym for rightNode
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function DivisionNode(_leftNode, _rightNode) {
	var self = this; 
	var $super = DivisionNode.$super(this, '∕', 3);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	Object.defineProperty(self, 'numerator', {
		get: function() {return self.leftNode;},
		set: function(value) {self.leftNode = value;}
	});
	 
	Object.defineProperty(self, 'denominator', {
		get: function() {return self.rightNode;},
		set: function(value) {self.rightNode = value;}
	});
	
	this.cleanup = function() {
		$super.cleanup();
	};
	
	this.simplify = function() {
		$super.simplify();
		
		var numerator = getScopedNodes(self.leftNode);
		var denominator = getScopedNodes(self.rightNode); 
		
		var negNodes = numerator.concat(denominator).filter(function(x) {
			return x instanceof NegativeNode || x instanceof RealNumberNode && x.value < 0;
		});
		var isNegative = negNodes.length % 2 !== 0;
		negNodes.forEach(function(x) { 
			if (x instanceof NegativeNode) {
				replaceNode(x, x.leftNode);
			} else {
				x.value = -x.value;
			}
		});
		
		if (instanceOf([self.leftNode, self.rightNode], [LeafNode, MultiplicationNode])) {
			Array.combos(numerator, denominator).forEach(function(combo) {
				if (instanceOf(combo, RealNumberNode)) {
					var gcd = commonDenominator(combo[0].value, combo[1].value);
					if (gcd) {
						combo[0].value /= gcd;
						combo[1].value /= gcd;
					}
				} else if (combo[0].equals(combo[1])) {
					replaceNode(combo[0], new RealNumberNode(1));
					replaceNode(combo[1], new RealNumberNode(1));
				}
			});
			$super.simplify();
		}/* else if (instanceOf([self.leftNode], [AdditionNode, SubtractionNode]) && self.rightNode instanceof RealNumberNode) {
			numerator.forEach(function(node) {
				node.rotateLeft(new DivisionNode(null, self.rightNode.value));
			});
			self.leftNode.simplify();
			replaceNode(self.leftNode);
		} */
		
		if (self.leftNode instanceof DivisionNode) { 
			self.rightNode = new MultiplicationNode(self.leftNode.rightNode, self.rightNode);
			self.leftNode = self.leftNode.leftNode;
		}
		
		if (self.denominator.equals(1)) {
			return isNegative ? new NegativeNode(self.numerator) : self.numerator;
		} else if (isNegative) {
			return new NegativeNode(self);
		}
	};
	
	function getScopedNodes(node) {
		//if (node instanceof ParenthesisNode) {node = node.leftNode;}
		return node instanceof MultiplicationNode ? node.nodes : [node];
	}
	
	function replaceNode(node, newNode) {
		var parent = [self, self.leftNode, self.rightNode].find(function(x) {
			return x.nodes.includes(node);
		});
		parent.replace(node, newNode);
	} 
}

function commonDenominator(a, b) {
	var vals = [a, b].map(Math.abs);
	for (var i = vals[0]; i >= 2; i--) {
		if (vals[0] % i === 0 && vals[1] % i === 0) {return i;}
	}
}


// ====================================================================================================
//      ../nodes/operators/Enclosures.js
// ====================================================================================================

Object.extend(BaseNode, EnclosureNode);
/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} openSymbol
 * @param {string} closeSymbol
 */
function EnclosureNode(openSymbol, closeSymbol) {
	var self = this;
	
	this.miniminumNodes = 1;
	
	self.openSymbol = openSymbol || '';
	self.closeSymbol = closeSymbol || ''; 
	
	var $super = EnclosureNode.$super(self, self.openSymbol + self.closeSymbol);
	
	self.printVals.before += self.openSymbol;
	
	self.printVals.after = self.closeSymbol + self.printVals.after;
	
	
	this.simplify = function() { 
		$super.simplify();
		if (self.leftNode instanceof LeafNode) {return self.leftNode;}
	};
} 

Object.extend(EnclosureNode, ParenthesisNode);
/**
 * @constructor
 * @extends {EnclosureNode}
 */
function ParenthesisNode() { 
	var self = this;
	var $super = ParenthesisNode.$super(self, '(', ')');
	
	this.cleanup = function() {
		$super.cleanup();
	};
}


// ====================================================================================================
//      ../nodes/operators/Exponents.js
// ====================================================================================================

/**
 * @constructor
 * @extends {OperatorNode}
 * @property {BaseNode} base   synonym for leftNode
 * @property {BaseNode} power   synonym for rightNode
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function ExponentNode(_leftNode, _rightNode) {
	var self = this;
	var $super = ExponentNode.$super(this, '^', 4, true);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	Object.defineProperty(self, 'base', {
		get: function() {return self.leftNode;},
		set: function(value) {self.leftNode = value;}
	});
	 
	Object.defineProperty(self, 'power', {
		get: function() {return self.rightNode;},
		set: function(value) {self.rightNode = value;}
	});
	
	this.simplify = function() {
		$super.simplify(); 
		if (self.rightNode.equals(1)) {
			return self.leftNode;
		} else if (self.rightNode.equals(0)) {
			return new RealNumberNode(1);
		} else if (instanceOf(self.nodes, RealNumberNode) && self.power.value >= 0) {
			var result = Math.pow(self.base.value, self.power.value); 
			return new RealNumberNode(result);
		}
	};
}
Object.extend(OperatorNode, ExponentNode);

/**
 * @constructor
 * @extends {OperatorNode}
 * @property {BaseNode} base   synonym for rightNode
 * @property {BaseNode} power   synonym for leftNode
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function NthRootNode(_leftNode, _rightNode) {
	var self = this;
	var $super = NthRootNode.$super(this, '&radic;');
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	 
	Object.defineProperty(self, 'power', {
		get: function() {return self.leftNode;},
		set: function(value) {self.leftNode = value;}
	});
	 
	Object.defineProperty(self, 'base', {
		get: function() {return self.rightNode;},
		set: function(value) {self.rightNode = value;}
	});
	
	this.simplify = function() {
		$super.simplify();
		if (instanceOf([self.leftNode, self.rightNode], RealNumberNode) && self.power.value !== 0) {
			var result = Math.pow(self.base.value, 1/self.power.value);
			if (Number.isInteger(result)) {
				return new RealNumberNode(result);
			}
		}
		 /*if (!instanceOf(self.leftNode, RealNumberNode)) {
			var exp = new ExponentNode(self.rightNode, new DivisionNode(1, self.leftNode));
			self.replaceWith(exp);
		}*/
	};
	
}
Object.extend(OperatorNode, NthRootNode); 

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 * @param {BaseNode} _rightNode
 */
function LogarithmNode(base, _rightNode) {  
	var self = this;
	var $super = LogarithmNode.$super(this, 'log', 3);
	
	this.leftNode = base || new RealNumberNode(10);
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() {
		$super.cleanup();
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


// ====================================================================================================
//      ../nodes/operators/Multiplication.js
// ====================================================================================================

Object.extend(CommutativeOpNode, MultiplicationNode);
/**
 * @constructor
 * @extends {CommutativeOpNode}
 * 
 * @param {BaseNode} _leftNode
 * @param {BaseNode} _rightNode
 */
function MultiplicationNode(_leftNode, _rightNode) {
	var self = this;
	var $super = MultiplicationNode.$super(this, '&sdot;', 3, 1, sortNodes, multiply, printSymbol);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	if (_rightNode) {this.rightNode = _rightNode;}
	
	this.cleanup = function() {
		$super.cleanup();
	};
	 
	function sortNodes(a, b) { 
		var OP_SEQ = [RealNumberNode, ConstantNode, ParenthesisNode, ExponentNode, VariableNode];
		var aIndex = OP_SEQ.indexOf(a.constructor), bIndex = OP_SEQ.indexOf(b.constructor);
		if (aIndex > -1 && bIndex > -1) {return aIndex - bIndex;} 
	}
	
	function multiply(a, b) {
		if (a instanceof RealNumberNode && b instanceof RealNumberNode) {
			a.value *= b.value;
		} else if (a instanceof LeafNode && a.equals(b)) {
			return new ExponentNode(a, 2); 
		} else if (a instanceof ExponentNode && a.leftNode.equals(b)) {
			a.power = new AdditionNode(a.rightNode, 1);
		} else if (a instanceof ExponentNode && b instanceof ExponentNode && a.leftNode.equals(b.leftNode)) {
			a.power = new AdditionNode(a.rightNode, b.rightNode);
		} else if (a instanceof DivisionNode) { 
			a.numerator = new MultiplicationNode(a.numerator, clone(a.denominator)); //TODO- this is dangerous, same node in 2 places
		} else {
			return null;
		}
		return a;
	}
	
	/** 
	 * @param {BaseNode} nextNode
	 * @returns {string}
	 */
	function printSymbol(nextNode) {
		if (nextNode instanceof VariableNode || nextNode.leftNode instanceof VariableNode) {
			return '<span class="operator coefficient"></span>';
		}
	}
   
}


// ====================================================================================================
//      ../nodes/operators/NegativeNode.js
// ====================================================================================================

Object.extend(OperatorPrefixNode, NegativeNode);
/**
 * @constructor
 * @extends {OperatorPrefixNode}
 * 
 * @param {BaseNode} _leftNode 
 */
function NegativeNode(_leftNode) {
	var self = this;
	var $super = NegativeNode.$super(this, '&minus;', 4);
	
	if (_leftNode) {this.leftNode = _leftNode;}
	 
	this.simplify = function() {
		$super.simplify(); 
		if (self.leftNode instanceof NegativeNode) {
			return self.leftNode.leftNode;
		} else if (self.leftNode instanceof RealNumberNode) {
			self.leftNode.value = -self.leftNode.value;
			return self.leftNode;
		}
	};
	
}


// ====================================================================================================
//      ../nodes/operators/Trigonometry.js
// ====================================================================================================

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


// ====================================================================================================
//      ../parseInput.js
// ====================================================================================================

var NODE_REGEX = {
	',': 'COMMA',
	'\\\)': 'CLOSE_PAREN',
	'\\\s': 'WHITESPACE',
	'\\\(': ParenthesisNode,
	'\\\+': AdditionNode,
	'[-−]': NegativeNode,
	'\\\+\/[-−]': PlusOrMinusNode,
	'±': PlusOrMinusNode,
	'[*·∙×\u22C5]': MultiplicationNode,
	'[\/∕÷]': DivisionNode, 
	'\\\^': ExponentNode,
	'log': LogarithmNode,
	'lg': Function.bind.call(LogarithmNode, null, new RealNumberNode(2)),
	'ln': Function.bind.call(LogarithmNode, null, ConstantNode.E()),
	
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
function parseNextNode(substring) {
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