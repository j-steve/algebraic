function compute(equation, prettyInput, output) {
	'use strict';
	var eq = equation.value;

	var activeNode = new OperatorNode();
	for (var i = 0; i < eq.length;) {
		var substring = eq.substring(i);
		var match;
		if (match = /^,\s*|^\(/.exec(substring)) {
			var op = new OperatorNode(Operators.Parenthesis);
			if (!activeNode.leftNode) { 
				activeNode.leftNode = op;
			} else {
				if (!activeNode.operator) {activeNode.operator = Operators.Coefficient;}
				op.leftNode = activeNode.rightNode;
				activeNode.rightNode = op;
			}
			activeNode = op;
		}
		
		else if (match = /^\)/.exec(substring)) {
			while (activeNode.operator !== Operators.Parenthesis) {
				activeNode = activeNode.parentNode;
				if (!activeNode) {return error(prettyInput, 'Unmatched parenthesis in position {0}.', i + 1);}
			}
			activeNode = activeNode.parentNode;
		
		} else if (match = /^[0-9]+/.exec(substring)) {
			var op = new LeafNode(Number(match[0]));
			if (!activeNode.leftNode) { 
				activeNode.leftNode = op;
			} else if (!activeNode.rightNode) {
				activeNode.rightNode = op;
			} else {
				var pivotTarget = activeNode;
				var pivotTargetParent = activeNode.parentNode;
				var coefficent = new OperatorNode(Operators.Coefficient);
				if (pivotTargetParent) {
					var nodeType = pivotTargetParent.leftNode === pivotTarget ? 'leftNode' : 'rightNode';
					pivotTargetParent[nodeType] = coefficent;
				}
				activeNode = coefficent; 
			}
		}

		i += match ? match[0].length : 1;
	};

	while (activeNode.parentNode) {activeNode = activeNode.parentNode;}

	prettyInput.innerHTML = '';
	activeNode.print(prettyInput);

	console.dir(activeNode); 
	//prettyInput.innerHTML = '<span>' + nodes.map(function(node) {return node.print();}).join('') + '</span>';
}

function findLastOperator(nodes) {
	for (var i = nodes.length - 1; i >= 0; i--) {
		if (nodes[i] instanceof Operator && !nodes[i].isClosed) {return nodes[i];}
	}
}

function error(input, message, args) { 
	var args = [].slice.call(arguments, 1);
	input.innerHTML = '<span style="color:red; font-size:80%;">' + String.format.apply(null, args) + '</span>';
}
