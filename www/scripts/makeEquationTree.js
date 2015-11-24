/* global ParenthesisNode, OperatorNode, LeafNode, parseInput, EnclosureNode, OperatorPrefixNode */

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
			closeTilType(EnclosureNode);
			if (!activeNode) {throw new Error('Unmatched ")" detected.');}
			activeNode = activeNode.parent;
		} else if (match.node === 'COMMA') {
			closeTilType(OperatorPrefixNode);
			activeNode.nodes.shift(); // chop off the Base: THAT was the base, next is operand
			activeNode = activeNode.rightNode = new ParenthesisNode();
		} else if (match.node instanceof EnclosureNode || match.node instanceof OperatorPrefixNode) { 
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

function closeTilType(nodeType) { 
	while (activeNode && !(activeNode instanceof nodeType)) {
		activeNode = activeNode.parent;
	}
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
		if (!newOperatorNode.rightToLeft && !activeNode.parent.rightToLeft) {
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