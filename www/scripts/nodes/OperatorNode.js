/* global BaseNode */ 

/**
 * @constructor
 * 
 * @param {string} debugSymbol
 * @returns {OperatorNode}
 */
function OperatorNode(debugSymbol, stickiness, rightToLeft) {
	'use strict';
	var self = this;
	
	BaseNode.call(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '</div>';
	
	this.stickiness = stickiness;
	
	this.leftToRight = !rightToLeft
}

Object.extend(BaseNode, OperatorNode);