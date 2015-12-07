/* global LeafNode, RealNumberNode, OperatorPrefixNode */

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