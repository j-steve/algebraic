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
			activeNode = match.node;
		} else if (match.node instanceof OperatorNode) { 
			activeNode.rotateLeft(match.node); 
			activeNode = match.node;
		} else if (match.node instanceof LeafNode) {
			addImplicitMultiply();
			activeNode.addChild(match.node);
			activeNode = match.node;
		}
		i += match.charCount;
	}
	 
	return getRoot(activeNode);
}

function closeParenthesis() { 
	while (!(activeNode instanceof EnclosureNode)) {
		activeNode = activeNode.parent;
	}
	if (!activeNode.parent) {throw new Error('Unmatched ")" detected.');}
	activeNode = activeNode.parent;
}

function addImplicitMultiply() {
	if (activeNode.leftNode) {
		if (activeNode.rightNode) {
			var implicitMultiplyNode = new MultiplicationNode();
			activeNode.rotateLeft(implicitMultiplyNode);
			activeNode = implicitMultiplyNode;
		}
	}
}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	return node;
}