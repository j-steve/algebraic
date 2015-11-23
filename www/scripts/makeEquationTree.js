/* global Operators */
/* global Operator */
/* global LeafNode */
/* global parseInput */

/* global ParenthesisNode */
/* global OperatorNode */
/* global LeafNode */

var activeNode;

/**
 * @param {string} inputEquation
 * @returns {OperatorNode}
 */
function makeEquationTree(inputEquation) {
	
	
	activeNode = new BaseNode();
	for (var i = 0; i < inputEquation.length;) {
		var match = parseInput(inputEquation.substring(i));
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
		i += match.match.length;
	}
	
	return getRoot(activeNode);
	
	

	function addImplicitMultiply() {
		if (activeNode.leftNode && (activeNode.rightNode || !(activeNode instanceof OperatorNode))) {
			var implicitMultiplyNode = new OperatorNode(Operators.Multiply);
			activeNode.rotateLeft(implicitMultiplyNode);
			activeNode = implicitMultiplyNode;
		}
	}
}
	
	
function makeEquationTree_old(inputEquation) {
	var activeNode = new OperatorNode();
	for (var i = 0; i < inputEquation.length;) {
		var match = parseInput(inputEquation.substring(i));
		if (match.type === 'OPEN-PAREN') {
			var opNode = new ParenthesisNode();
			if (!activeNode.operator) {
				var implicitMultiplyNode = new OperatorNode(Operators.Multiply);
				activeNode.rotateLeft(implicitMultiplyNode);
				implicitMultiplyNode.rightNode = opNode; 
			}
			if (activeNode.rightNode) {   // catches "1^2(3..."
				activeNode.rightNode.rotateLeft(opNode);
			} else if (activeNode.operator) { // catches "1^2(..."
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.leftNode) { // catches "2(3..."
				activeNode.operator = Operators.Multiply;
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.parent && !activeNode.parenthesis) {
				activeNode = activeNode.addChildNode(null, true);
			} else {
				alert('whoops');
				throw new Error('whoops');
				//activeNode.parenthesis = true;
			}
			activeNode = opNode;
		} else if (match.type === 'CLOSE-PAREN') {
			while (!activeNode.parenthesis && activeNode.parent) {
				activeNode = activeNode.parent;
				//if (!activeNode) {throw new Error(String.format('Unmatched parenthesis at position {0}.', i+1));}
			}
			if (!activeNode.parent) { // The root-level node had parenthesis closed.
				var newRoot = new OperatorNode();
				newRoot.leftNode = activeNode._setParent(newRoot, 'leftNode');
			}
			activeNode = activeNode.parent;
		} else if (match.type instanceof Operator) {
			
			/** @type {Operator} */ var operator = match.type;
			if (!activeNode.operator) {
				activeNode.operator = operator;
			} else {
				while (!activeNode.parenthesis && activeNode.operator.isTighterThan(operator) && activeNode.parent) {
					activeNode = activeNode.parent;
				}
				if (activeNode.rightNode && !activeNode.operator.isTighterThan(operator)) {
					var opNode = new OperatorNode(new OperatorNode(operator));
					activeNode.rightNode.rotateLeft(opNode);
					activeNode = opNode;
				} else if (activeNode.parenthesis) {
					activeNode.parenthesis = false;
					var opNode = new OperatorNode(new OperatorNode(operator));
					activeNode.rotateLeft(opNode);
					opNode.parenthesis = true;
					activeNode = opNode;

				} else {
					activeNode = activeNode.addChildNode(operator);
				}
			}
		} else if (match.type instanceof LeafNode) {
			
			/** @type {LeafNode} */ var leafNode = match.type;
			
			if (activeNode.rightNode) { // catches "43^4x..."
				// TODO - make "5xy" evaluate left to right
				if (!activeNode.parent) {
					var opNode = new OperatorNode(Operators.Coefficient);
					opNode.leftNode = activeNode;
					opNode.rightNode = leafNode;
					activeNode = opNode;
				} else {
					var opNode = new OperatorNode(Operators.Coefficient);
					activeNode.rotateLeft(opNode);
					opNode.setLeaf(leafNode);
					activeNode = opNode;
				}
			} else if (activeNode.operator || !activeNode.leftNode) { // If it's totally empty or has operator but no rightNode then it's ready for a leaf. (Catches "4+x...")
				activeNode.setLeaf(leafNode);
			} else { // catches "4x..." 
				activeNode.operator = Operators.Coefficient;
				activeNode.setLeaf(leafNode);
			}
		}

		i += match.match.length;
	}
	
	return getRoot(activeNode);

}

function getRoot(node) {
	while (node.parent) {
		node = node.parent;
	}

	return node;
}
