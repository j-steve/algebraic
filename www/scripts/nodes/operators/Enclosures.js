/* global BaseNode, OperatorNode, LeafNode */

Object.extend(BaseNode, EnclosureNode);
/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} openSymbol
 * @param {string} closeSymbol
 */
function EnclosureNode(openSymbol, closeSymbol) {
	var self = this;
	
	this.miniminumNodes = 1;
	
	self.openSymbol = openSymbol || '';
	self.closeSymbol = closeSymbol || ''; 
	
	var $super = EnclosureNode.$super(self, self.openSymbol + self.closeSymbol);
	
	self.printVals.before += self.openSymbol;
	
	self.printVals.after = self.closeSymbol + self.printVals.after;
	
	
	this.simplify = function() { 
		$super.simplify();
		if (self.leftNode instanceof LeafNode) {return self.leftNode;}
	};
} 

Object.extend(EnclosureNode, ParenthesisNode);
/**
 * @constructor
 * @extends {EnclosureNode}
 */
function ParenthesisNode() { 
	var self = this;
	var $super = ParenthesisNode.$super(self, '(', ')');
	
	this.cleanup = function() {
		$super.cleanup();
	};
}
