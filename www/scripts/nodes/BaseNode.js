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
		before: '<div class="node operator-node">',
		middle: '',
		after: '</div>'
	};

    // ================================================================================
    // Methods
    // ================================================================================
	
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

