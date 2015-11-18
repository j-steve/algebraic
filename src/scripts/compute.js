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
			// TODO- add support for coefficent mutliplication like 4(54)
			if (activeNode.rightNode) {
				activeNode = activeNode.replaceChildNode(null, true);
			} else {
				activeNode = activeNode.addChildNode(null, true);
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
		} else if (match = /^[0-9]+/.exec(substring)) {
			activeNode.setLeaf(match[0]);
		}

		i += match ? match[0].length : 1;
	};

	while (activeNode.parentNode) {
		activeNode = activeNode.parentNode;
	}

	activeNode.print(treeTableElement);

	prettyInputElement.innerHTML = '<span>' + activeNode.prettyInput() + '</span>';

	resultElement.innerHTML = activeNode.solve();
}

function error(input, message, args) { 
	var args = [].slice.call(arguments, 1);
	input.innerHTML = '<span style="color:red; font-size:80%;">' + String.format.apply(null, args) + '</span>';
}
