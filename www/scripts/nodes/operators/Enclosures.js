/* global BaseNode */

function EnclosureNode(openSymbol, closeSymbol) {
	var self = this;
	
	this.openSymbol = openSymbol || '';
	this.closeSymbol = closeSymbol || ''; 
	
	BaseNode.call(this, this.openSymbol + this.closeSymbol);
	
	this.prettyInput = function() {
		return this.openSymbol + self.nodes.map(function(node) {return node.prettyInput();}).join('') + this.closeSymbol;
	};
	
	this.printVals.before += '(';
	
	this.printVals.after = ')' + this.printVals.after;
} 
Object.extend(BaseNode, EnclosureNode);

function ParenthesisNode() { 
	EnclosureNode.call(this, '(', ')');
}
Object.extend(EnclosureNode, ParenthesisNode);

function LogarithmNode(base) {  
	
	EnclosureNode.call(this, 'log(', ')');
	
	if (base) {this.leftNode = base;}
}
Object.extend(EnclosureNode, LogarithmNode);