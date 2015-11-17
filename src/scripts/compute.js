function compute(equation, treeTable, prettyInput, output) {
	'use strict';

	treeTable.innerHTML = '';
	prettyInput.innerHTML = '';
	output.innerHTML = '';

	var eq = equation.value;

	var activeNode = new OperatorNode();
	for (var i = 0; i < eq.length;) {
		var substring = eq.substring(i);
		var match = null;
		var operator = Operator.find(substring);
		if (operator) {
			match = operator.regex.exec(substring);
			if (!activeNode.operator) {
				activeNode.operator = operator;
			} else {
				while (!operator.isTighterThan(activeNode.operator) && activeNode.parentNode) {
					activeNode = activeNode.parentNode;
				}
				if (operator.isTighterThan(activeNode.operator)) {
					activeNode = activeNode.replaceChildNode(operator);
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

	activeNode.print(treeTable);

	prettyInput.innerHTML = '<span>' + activeNode.prettyInput() + '</span>';

	console.dir(activeNode);
}




function error(input, message, args) { 
	var args = [].slice.call(arguments, 1);
	input.innerHTML = '<span style="color:red; font-size:80%;">' + String.format.apply(null, args) + '</span>';
}




		// var substring = eq.substring(i);
		// var match;

		// if (match = /^,\s*|^\(/.exec(substring)) {
		// 	if (activeNode.leftNode && !activeNode.operator) {
		// 		activeNode.operator = Operators.Coefficient;
		// 	}
		// 	activeNode = activeNode.setChildNode(Operators.Parenthesis);

		
		// } else if (match = /^\)/.exec(substring)) {
		// 	while (activeNode.operator !== Operators.Parenthesis) {
		// 		activeNode = activeNode.parentNode;
		// 		if (!activeNode) {return error(prettyInput, 'Unmatched parenthesis in position {0}.', i + 1);}
		// 	}
		// 	activeNode = activeNode.parentNode;

		// } else if (match = /^[0-9]+/.exec(substring)) {
		// 	var op = new LeafNode(Number(match[0]));
		// 	if (!activeNode.leftNode) { 
		// 		activeNode.leftNode = op;
		// 	} else if (!activeNode.rightNode) {
		// 		activeNode.rightNode = op;
		// 	} else {
		// 		// TODO- make this work.
		// 		debugger;
		// 		/*
		// 		var pivotTarget = activeNode;
		// 		var pivotTargetParent = activeNode.parentNode;
		// 		var coefficent = new OperatorNode(Operators.Coefficient);
		// 		if (pivotTargetParent) {
		// 			var nodeType = pivotTargetParent.leftNode === pivotTarget ? 'leftNode' : 'rightNode';
		// 			pivotTargetParent[nodeType] = coefficent;
		// 		}
		// 		coefficent.leftNode = pivotTarget;
		// 		coefficent.rightNode = op;
		// 		activeNode = coefficent; 
		// 		*/
		// 	}

		// } else { 
		// 	var op = Operators.all.find(function(operator) {return operator.regex.exec(substring);});
		// 	if (op) {
		// 		match = op.regex.exec(substring);
		// 		activeNode = activeNode.setChildNode(op);
		// 	}
		// }

		// i += match ? match[0].length : 1;