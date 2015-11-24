/* global BaseNode, OperatorNode, LeafNode */

/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} openSymbol
 * @param {string} closeSymbol
 */
function EnclosureNode(openSymbol, closeSymbol) {
	var self = this;
	
	self.openSymbol = openSymbol || '';
	self.closeSymbol = closeSymbol || ''; 
	
	BaseNode.call(self, self.openSymbol + self.closeSymbol);
	
	self.printVals.before += self.openSymbol;
	
	self.printVals.after = self.closeSymbol + self.printVals.after;
} 
Object.extend(BaseNode, EnclosureNode);

/**
 * @constructor
 * @extends {EnclosureNode}
 */
function ParenthesisNode() { 
	var self = this;
	
	EnclosureNode.call(self, '(', ')');
	
	var baseCleanup = this.cleanup;
	this.cleanup = function() {
		baseCleanup.call(self);
		if (self.leftNode instanceof LeafNode) {
			self.replaceWith(self.leftNode);
		}
	};
}
Object.extend(EnclosureNode, ParenthesisNode);
