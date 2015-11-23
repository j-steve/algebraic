
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
	var self = this;

    // ================================================================================
    // Properties
    // ================================================================================
	
	this.parent = parentNode;
	
	this.nodes = [];
	
	Object.defineProperty(this, 'leftNode', {
		get: function() {return this.nodes[0];},
		set: function(value) {this.nodes[0] = value;}
	});
	
	Object.defineProperty(this, 'rightNode', {
		get: function() {return this.nodes[1];},
		set: function(value) {this.nodes[1] = value;}
	});

    // ================================================================================
    // Methods
    // ================================================================================
	
	this.replaceChild = function(oldChild, newChild) {
		var i = self.nodes.indexOf(oldChild);
		if (i === -1) {throw new Error('Cannot replace ' + oldChild + ': not a child of this node.');}
		
		self.nodes[i] = newChild;
		newChild.parent = self;
		
		newChild.leftNode = oldChild;
		oldChild.parent = newChild;
	};
	
	
};

