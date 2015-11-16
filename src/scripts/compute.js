function compute(equation, prettyInput, output) {
	var eq = equation.value;

	var nodes = [];
	for (var i = 0; i < eq.length;) {
		var node = Node.parse(eq.substring(i));
		if (node.type !== 'Unknown') {
			if (node instanceof Operator) {
				var lastOp = findLastOperator(nodes);
				while (lastOp && lastOp.tightness > node.tightness) {
					nodes.push(lastOp.close());
					lastOp = findLastOperator(nodes);
				}
			} else if (node instanceof ValueNode && nodes.peek() instanceof ValueNode) {
				nodes.push(new Operator('Coefficent', '&sdot;', '', 5));
			}
			nodes.push(node);
		}
		i += node.charCount;
	};

	console.dir(nodes);
	prettyInput.innerHTML = '<span>' + nodes.map(function(node) {return node.print();}).join('') + '</span>';
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
