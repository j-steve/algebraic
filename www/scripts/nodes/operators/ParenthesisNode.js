/* global BaseNode */
/* global OperatorNode */

function ParenthesisNode() {
	'use strict';
	var self = this;
	
	OperatorNode.call(this);
	
	this.prettyInput = function() {
		return '(' + self.nodes.map(function(node) {return node.prettyInput();}).join('') + ')';
	};
	
	this.printVals.before += '('
	this.printVals.after = ')' + this.printVals.after;
	
}
Object.extend(OperatorNode, ParenthesisNode);