/* global ParenthesisNode, OperatorNode, LeafNode, parseNextNode, EnclosureNode, OperatorPrefixNode, TreeRootNode */

/**
 * @constructor
 * @property {TreeRootNode} root
 * 
 * @param {string} inputEquation
 */
function EquationTree(inputEquation) {
	
	/** @type {Array} */
	var nodeStack = [];
	
	Object.defineProperty(this, 'root', {get: function() {return nodeStack[0];}});

	function parse() { 
		nodeStack = [new TreeRootNode()];
		for (var i = 0; i < inputEquation.length;) {
			var match = parseNextNode(inputEquation.substring(i));
			if (!match) {throw new Error(String.format('Invalid character: "{0}"', inputEquation[i]));}
			if (match.node === 'CLOSE_PAREN') {
				closeTilType(EnclosureNode);
				if (!nodeStack.length) {throw new Error('Unmatched ")" detected.');}
				nodeStack.pop();
			} else if (match.node === 'COMMA') {
				closeTilType(OperatorPrefixNode);
				nodeStack.peek().nodes.shift(); // chop off the Base: THAT was the base, next is operand
				var parenthesis = new ParenthesisNode();
				nodeStack.peek().rightNode = parenthesis;
				nodeStack.push(parenthesis);
			} else if (match.node instanceof EnclosureNode || match.node instanceof OperatorPrefixNode) { 
				addChildNode(match.node);
			} else if (match.node instanceof OperatorNode) {
				rotateForOperator(match.node); 
			} else if (match.node instanceof LeafNode) {
				addChildNode(match.node);
			}
			if (typeof match.node !== 'string') {
				nodeStack.push(match.node);
			}
			i += match.charCount;
		} 

		nodeStack[0].finalize();
		return nodeStack[0];
	}
	
	function addChildNode(newNode) {
		addImplicitMultiply();
		nodeStack.peek().nodes.push(newNode);
	}

	function closeTilType(nodeType) { 
		while (nodeStack.length && !instanceOf(nodeStack.peek(), nodeType)) {
			nodeStack.pop();
		}
	}

	function addImplicitMultiply() {
		if (nodeStack.peek() instanceof LeafNode) {
			var implicitMultiplyNode = new MultiplicationNode(); 
			implicitMultiplyNode.stickiness += 1;
			rotateForOperator(implicitMultiplyNode);
			nodeStack.push(implicitMultiplyNode);
		}
	}

	function rotateForOperator(newOperatorNode) {
		while (activeNodeSticksToOperator(newOperatorNode) && parentOfLatest()) {
			nodeStack.pop();
		}
		var oldOp = nodeStack.pop();
		nodeStack.peek().rotateLeft(oldOp, newOperatorNode);
	}

	function activeNodeSticksToOperator(newOperatorNode) {  
		if (parentOfLatest() instanceof OperatorNode) {
			if (!newOperatorNode.rightToLeft && !parentOfLatest().rightToLeft) {
				return newOperatorNode.stickiness <= parentOfLatest().stickiness;
			} else {
				return newOperatorNode.stickiness < parentOfLatest().stickiness;
			}
		} else {
			return false;
		}
	}
	
	function parentOfLatest() {
		return nodeStack[nodeStack.length - 2]; 
	}
	
	return parse();
}
