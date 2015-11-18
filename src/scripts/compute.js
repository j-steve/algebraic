function compute(equation, treeTableElement, prettyInputElement, resultElement) {
	'use strict';

	treeTableElement.innerHTML = '';
	prettyInputElement.innerHTML = '';
	resultElement.innerHTML = '';

	var eq = equation.value;

	var activeNode = new OperatorNode();
	for (var i = 0; i < eq.length;) {
		var substring = eq.substring(i);
		var match = null;
		var operator;
		if (match = /^,\s*|^\(/.exec(substring)) {
			if (activeNode.rightNode) {   // catches "1^2(3..."
				activeNode = activeNode.replaceChildNode(Operators.Multiply)
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.operator) { // catches "1^2(..."
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.leftNode) { // catches "2(3..."
				activeNode.operator = Operators.Multiply;
				activeNode = activeNode.addChildNode(null, true);
			} else if (activeNode.parentNode && !activeNode.parenthesis) {
				activeNode = activeNode.addChildNode(null, true);
			} else {
				activeNode.parenthesis = true
			}
		} else if (match = /^\)/.exec(substring)) {
			while (!activeNode.parenthesis) {
				activeNode = activeNode.parentNode;
				if (!activeNode) {return error(prettyInputElement, 'Unmatched parenthesis at position {0}.', i+1);}
			}
			activeNode = activeNode.parentNode;
		} else if (operator = Operator.find(substring)) {
			match = operator.regex.exec(substring);
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
					activeNode = activeNode.parentNode.replaceChildNode(operator)
					activeNode.parenthesis = true;

				} else {
					activeNode = activeNode.addChildNode(operator);
				}
			}
		} else if (match = /^[0-9]+|^[A-Za-z]/.exec(substring)) {
			if (activeNode.rightNode) { // catches "43^4x..."
				// TODO - make "5xy" evaluate left to right
				if (!activeNode.parentNode) {
					activeNode.parentNode = new OperatorNode();
					activeNode.parentNode.leftNode = activeNode._setParent(activeNode.parentNode, 'leftNode');
				}
				activeNode = activeNode.parentNode.replaceChildNode(Operators.Coefficient)
				activeNode.setLeaf(match[0]);
			} else if (activeNode.operator || !activeNode.leftNode) { // If it's totally empty or has operator but no rightNode then it's ready for a leaf. (Catches "4+x...")
				activeNode.setLeaf(match[0]);
			} else { // catches "4x..." 
				activeNode.operator = Operators.Coefficient;
				activeNode.setLeaf(match[0]);
			}
		}

		i += match ? match[0].length : 1;
	};

	while (activeNode.parentNode) {
		activeNode = activeNode.parentNode;
	}

	activeNode.print(treeTableElement);

	prettyInputElement.innerHTML = '<span>' + activeNode.prettyInput() + '</span>';

	resultElement.innerHTML = activeNode.solve();

	//resultElement.innerHTML = activeNode.simplify();
}

function error(input, message, args) { 
	var args = [].slice.call(arguments, 1);
	input.innerHTML = '<span style="color:red; font-size:80%;">' + String.format.apply(null, args) + '</span>';
}
