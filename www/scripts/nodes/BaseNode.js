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
				//if (value === self) {throw new Error('Cannot set as own child.');}
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
	this.decendants = function() {
		var children = self.nodes.slice();
		self.nodes.forEach(function(node) {
			children = children.concat(node.decendants());
		});
		return children;
	};
	
	
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
		return newNode;
	};
	
	this.rotateRight = function(newNode) {
		if (self.parent) {self.replaceWith(newNode);}
		newNode.rightNode = self;
		return newNode;
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
	this.replaceWith = function(replacementNode, stealNodes, takeReplacementParent) {
		if (!self.parent) {self.parent = new BaseNode();}
		var side = self.side();
		var parent = self.parent;
		if (takeReplacementParent && replacementNode && replacementNode.parent) { 
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

