/* global OperatorPrefixNode */

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function SinNode() {  
	OperatorPrefixNode.call(this, 'sin', 3);
}
Object.extend(OperatorPrefixNode, SinNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function CosNode() {  
	OperatorPrefixNode.call(this, 'cos', 3);
}
Object.extend(OperatorPrefixNode, CosNode);

/**
 * @constructor
 * @extends {OperatorPrefixNode}
 */
function TanNode() {  
	OperatorPrefixNode.call(this, 'tan', 3);
}
Object.extend(OperatorPrefixNode, TanNode);