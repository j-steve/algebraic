/* global LeafNode, RealNumberNode */

var SIDES = ['leftNode', 'rightNode'];

/**
 * @constructor
 * 
 * @property {BaseNode} parent
 * @property {Array} nodes
 * @property {BaseNode} leftNode
 * @property {BaseNode} rightNode
 */
function BaseNode() {
	var self = this;

    // ================================================================================
    // Properties
    // ================================================================================
	
	this.parent = null;
	
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
	
	this.addChild = function(newNode) {
		var nextNode = self.nodes.length;
		if (nextNode >= SIDES.length) {
			//throw new Error('Cannot add child, already has all children.');
			this.rotateLeft(newNode);
		} else {
			self[SIDES[nextNode]] = newNode;
		}
	};
	
	this.remove = function() {
		self.parent.nodes.remove(self);
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
	
	this.finalize = function() { 
		self.nodes.forEach(function(node) {
			var fnode = node.removeIfObsolete();
			if (fnode) {fnode.finalize();}
		}); 
	};
	
	this.removeIfObsolete = function() {
		switch (self.nodes.length) {
			case 0:		self.detach(); 						return null;
			case 1:		self.replaceWith(self.leftNode);	return self.leftNode;
			default:	return self;
		}
	};
	
	this.cleanup = function() { 
		self.nodes.forEach(function(node) {
			node.cleanup();
			node.removeIfObsolete();
		});
	};
	
	this.simplify = function() {
		//self.nodes.forEach(function(node) {node.simplify();});
		
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