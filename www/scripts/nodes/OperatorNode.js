/* global BaseNode */ 

/**
 * @constructor
 * 
 * @param {string} debugSymbol
 * @returns {OperatorNode}
 */
function OperatorNode(debugSymbol) {
	'use strict';
	var self = this;
	
	BaseNode.call(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '<div>';
}

Object.extend(BaseNode, OperatorNode);