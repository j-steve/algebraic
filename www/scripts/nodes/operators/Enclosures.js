/* global BaseNode, OperatorNode */

/**
 * @constructor
 * @extends {BaseNode}
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
	EnclosureNode.call(this, '(', ')');
}
Object.extend(EnclosureNode, ParenthesisNode);
