/* global ParenthesisNode, OperatorNode, LeafNode, parseInput, EnclosureNode */

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
		if (match.node === 'CLOSE_PAREN') {
			closeParenthesis();
		} else if (match.node instanceof EnclosureNode) { 
			addImplicitMultiply();
			activeNode.addChild(match.node);
		} else if (match.node instanceof OperatorNode) {
			rotateForOperator(match.node); 
		} else if (match.node instanceof LeafNode) {
			addImplicitMultiply();
			{activeNode.addChild(match.node);}
		}
		if (typeof match.node !== 'string') {activeNode = match.node;}
		i += match.charCount;
	}
	 
	return getRoot(activeNode);
}

function closeParenthesis() { 
	while (!(activeNode instanceof ParenthesisNode)) {
		activeNode = activeNode.parent;
		if (!activeNode.parent) {throw new Error('Unmatched ")" detected.');}
	}
	activeNode = activeNode.parent;
}

function addImplicitMultiply() {
	if (activeNode instanceof LeafNode) {
		var implicitMultiplyNode = new MultiplicationNode();
		implicitMultiplyNode.stickiness = 4;
		rotateForOperator(implicitMultiplyNode);
		activeNode = implicitMultiplyNode;
	}
}

function rotateForOperator(newOperatorNode) {
	while (activeNodeSticksToOperator(newOperatorNode) && activeNode.parent) {
		activeNode = activeNode.parent;
	}
	activeNode.rotateLeft(newOperatorNode);
}

function activeNodeSticksToOperator(newOperatorNode) {
	if (activeNode.parent instanceof OperatorNode) {
		if (newOperatorNode.leftToRight && activeNode.parent.leftToRight) {
			return newOperatorNode.stickiness <= activeNode.parent.stickiness;
		} else {
			return newOperatorNode.stickiness < activeNode.parent.stickiness;
		}
	} else {
		return false;
	}
}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	return node;
}