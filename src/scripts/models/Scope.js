function Scope(parentScope) {
	this.isRoot = !parentScope;
	this.parentScope = parentScope;
	this.nodes = [];

	this.open = function() {
		return this.isRoot ? '' : '(';
	};

	this.close = function() {
		var result = '';
		while (this.nodes.peek()) {
			result += this.nodes.pop().close();
		}
		if (!this.isRoot) {result += ')';}
		return result;
	};
}