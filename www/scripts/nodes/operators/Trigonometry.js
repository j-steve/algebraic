/* global OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function SinNode() {  
	SinNode.$super(this, 'sin', 3);
}
Object.extend(OperatorPrefixNode, SinNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function CosNode() {  
	CosNode.$super(this, 'cos', 3);
}
Object.extend(OperatorPrefixNode, CosNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function TanNode() {  
	TanNode.$super(this, 'tan', 3);
}
Object.extend(OperatorPrefixNode, TanNode);