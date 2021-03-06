/* global OperatorNode, OperatorPrefixNode, RealNumberNode */

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