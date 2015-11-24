/* global LeafNode */

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
	
	/*this.decendantNodes = function() {
		var children = self.nodes.slice();
		self.nodes.forEach(function(node) {
			children = children.concat(node.decendantNodes());
		});
		return children;
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

