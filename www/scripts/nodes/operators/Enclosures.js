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
	
	EnclosureNode.$super(self, self.openSymbol + self.closeSymbol);
	
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
	var $super = ParenthesisNode.$super(self, '(', ')');
	
	this.cleanup = function() {
		$super.cleanup();
	};
}
Object.extend(EnclosureNode, ParenthesisNode);
