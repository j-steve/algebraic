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
	BaseNode.call(this);
	
	this.printVals.middle =  '<div class="operator">' + debugSymbol + '</div>';
	
	this.stickiness = stickiness;
	
	this.rightToLeft = !!rightToLeft;
}
Object.extend(BaseNode, OperatorNode);

/**
 * @constructor
 * @extends {OperatorNode}
 */
function OperatorPrefixNode() { 
	OperatorNode.apply(this, arguments);
}
Object.extend(OperatorNode, OperatorPrefixNode);