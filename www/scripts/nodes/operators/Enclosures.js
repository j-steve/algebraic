/* global BaseNode */

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

/**
 * @constructor
 * @extends {EnclosureNode}
 * 
 * @param {BaseNode} [base]   the log base, reprsented by the right node
 */
function LogarithmNode(base) {  
	EnclosureNode.call(this, 'log');
	
	this.stickiness = 3; 
	
	if (base) {this.leftNode = base;}
}
Object.extend(EnclosureNode, LogarithmNode);