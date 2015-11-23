/* global ParenthesisNode, OperatorNode, LeafNode, parseInput */

var activeNode;

/**
 * @param {string} inputEquation
 * @returns {OperatorNode}
 */
function makeEquationTree(inputEquation) {
	
	
	activeNode = new BaseNode();
	for (var i = 0; i < inputEquation.length;) {
		var match = parseInput(inputEquation.substring(i));
		if (!match) {throw new Error(String.format('Invalid character: "{0}"', inputEquation[i]));}
		if (match.node instanceof ParenthesisNode) { 
			addImplicitMultiply();
			activeNode.addChild(match.node);
			activeNode = match.node;
		} else if (match.node instanceof OperatorNode) { 
			activeNode.rotateLeft(match.node); 
			activeNode = match.node;
		} else if (match.node instanceof LeafNode) {
			addImplicitMultiply();
			activeNode.addChild(match.node);
		}
		i += match.charCount;
	}
	
	return getRoot(activeNode);
} 

function addImplicitMultiply() {
	if (activeNode.leftNode && (activeNode.rightNode || !(activeNode instanceof OperatorNode))) {
		var implicitMultiplyNode = new MultiplicationNode();
		activeNode.rotateLeft(implicitMultiplyNode);
		activeNode = implicitMultiplyNode;
	}
}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	return node;
}