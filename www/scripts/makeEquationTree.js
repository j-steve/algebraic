/* global ParenthesisNode, OperatorNode, LeafNode, parseNextNode, EnclosureNode, OperatorPrefixNode, TreeRootNode, CommutativeOpNode */

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

		finalize(nodeStack[0]);
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
	
	function finalize(node) { 
		if (node instanceof CommutativeOpNode) {setNodesInScope(node);}
		
		node.nodes.forEach(function(n) {
			finalize(n);
			if (n.nodes.length <= 1 && !instanceOf(n, [LeafNode, TreeRootNode])) {
				node.replace(n, n.leftNode); // replace with any existing child, or remove if no children
			}
		}); 
	}
	
	function setNodesInScope(target) { 
		var nodeStack = target.nodes.splice(0);
		while (nodeStack.length) {
			var node = nodeStack.shift();
			if (node instanceof target.constructor) {
				nodeStack = node.nodes.concat(nodeStack);
			} else {
				target.nodes.push(node);
			}
		} 
	}
	
	return parse();
}
