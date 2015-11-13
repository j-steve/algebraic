function Scope(parent) {
	this.isRoot = !!parent;
	this.parent = parent;
	this.leftNode = null;
	this.rightNode = null;
	this.operator = null;
	
	this.addNode = function(child) {
	};
	

	this.lastNode = function() {
		return this.rightNode || this.operator || this.leftNode;
	};
}