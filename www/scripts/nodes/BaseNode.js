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
				value.parent = self;
				self.nodes[index] = value;
			}
		});
	});
	
	this.printVals = {
		before: '<div class="node">',
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
	
	/*this.replaceChild = function(oldChild, newChild) {
		if (!oldChild) {throw new TypeError('oldChild cannot be null.');}
		if (!newChild) {throw new TypeError('newChild cannot be null.');}
		
		var i = self.nodes.indexOf(oldChild);
		if (i === -1) {throw new Error('Cannot replace ' + oldChild + ': not a child of this node.');}
		
		self[SIDES[i]] = newChild; 
		newChild.leftNode = oldChild;
	};*/
	
	
}

