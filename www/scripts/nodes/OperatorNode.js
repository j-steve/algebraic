/* global BaseNode */ 

/**
 * @constructor
 * @extends {BaseNode}
 * 
 * @param {string} debugSymbol 
 * @param {number} stickiness
 * @param {boolean} [rightToLeft=false]
 */
function OperatorNode(debugSymbol, stickiness, rightToLeft) { 
	OperatorNode.$super(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '</div>';
	
	this.stickiness = stickiness;
	
	this.rightToLeft = !!rightToLeft;
}
Object.extend(BaseNode, OperatorNode);

/**
 * @constructor
 * @extends {OperatorNode}
 * 
 * @param {string} debugSymbol 
 * @param {number} stickiness
 * @param {boolean} [rightToLeft=false]
 */
function OperatorPrefixNode(debugSymbol, stickiness, rightToLeft) { 
	OperatorPrefixNode.$super(this, debugSymbol, stickiness, rightToLeft);
}
Object.extend(OperatorNode, OperatorPrefixNode);