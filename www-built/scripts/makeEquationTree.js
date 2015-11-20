/* global Operators */
/* global Operator */
/* global parseInput */

/**
 * @param {string} inputEquation
 * @returns {OperatorNode}
 */
function makeEquationTree(inputEquation) {
	
	var activeNode = new OperatorNode();
	for (var i = 0; i < inputEquation.length;) {
		var match = parseInput(inputEquation.substring(i));
		if (match.type === 'OPEN-PAREN') {
			if (activeNode.rightNode) {   // catches "1^2(3..."
				activeNode = activeNode.replaceChildNode(Operators.Multiply);
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.operator) { // catches "1^2(..."
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.leftNode) { // catches "2(3..."
				activeNode.operator = Operators.Multiply;
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.parentNode && !activeNode.parenthesis) {
				activeNode = activeNode.addChildNode(null, true);
			} else {
				activeNode.parenthesis = true;
			}
		} else if (match.type === 'CLOSE-PAREN') {
			while (!activeNode.parenthesis) {
				activeNode = activeNode.parentNode;
				if (!activeNode) {throw new Error(String.format('Unmatched parenthesis at position {0}.', i+1));}
			}
			activeNode = activeNode.parentNode;
		} else if (match.type instanceof Operator) {
			
			/** @type {Operator} */ var operator = match.type;
			if (!activeNode.operator) {
				activeNode.operator = operator;
			} else {
				while (!activeNode.parenthesis && !operator.isTighterThan(activeNode.operator) && activeNode.parentNode) {
					activeNode = activeNode.parentNode;
				}
				if (activeNode.rightNode && operator.isTighterThan(activeNode.operator)) {
					activeNode = activeNode.replaceChildNode(operator);
				} else if (activeNode.parenthesis) {
					activeNode.parenthesis = false;
					activeNode = activeNode.parentNode.replaceChildNode(operator);
					activeNode.parenthesis = true;

				} else {
					activeNode = activeNode.addChildNode(operator);
				}
			}
		} else if (match.type === 'ALPHANUMERIC') {
			if (activeNode.rightNode) { // catches "43^4x..."
				// TODO - make "5xy" evaluate left to right
				if (!activeNode.parentNode) {
					activeNode.parentNode = new OperatorNode();
					activeNode.parentNode.leftNode = activeNode._setParent(activeNode.parentNode, 'leftNode');
				}
				activeNode = activeNode.parentNode.replaceChildNode(Operators.Coefficient);
				activeNode.setLeaf(match[0]);
			} else if (activeNode.operator || !activeNode.leftNode) { // If it's totally empty or has operator but no rightNode then it's ready for a leaf. (Catches "4+x...")
				activeNode.setLeaf(match[0]);
			} else { // catches "4x..." 
				activeNode.operator = Operators.Coefficient;
				activeNode.setLeaf(match[0]);
			}
		}

		i += match.match.length;
	}

	while (activeNode.parentNode) {
		activeNode = activeNode.parentNode;
	}
}