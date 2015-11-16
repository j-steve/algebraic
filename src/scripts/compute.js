function compute(equation, prettyInput, output) {
	var eq = equation.value;

	var nodes = [];
	for (var i = 0; i < eq.length;) {
		var node = Node.parse(eq.substring(i));
		if (node instanceof Operator) {
			var lastOp = findLastOperator(nodes);
			if (lastOp && lastOp.tightness > node.tightness) {
				nodes.push(lastOp.close());
			}
		}
		nodes.push(node);
		i += node.charCount;
	};

	console.dir(nodes);
	prettyInput.innerHTML = '<span>' + nodes.map(function(node) {return node.print();}).join('') + '</span>';
	//prettyInput.innerHTML = nodes;
	
	//prettyInput.innerHTML = ops.map(function(op) {op.close(); return typeof op === 'string' ? op : op.render();}).join('');
	//prettyInput.innerHTML = eq.join('');
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

function formatEquation(eq) {
	eq = eq.trim();
	
	var patterns = [
		[/lb|log2/gi, '①'],
		[/ln/gi, '②'],
		[/lg|log10/gi, '③'],
		[/log/gi, '④'],
		[/×/g, '*'],

		[/pi/gi, 'π'],

		[/([A-Z])()([A-Z0-9①②③④])/gi, '$1×$3'],
		[/([A-Z0-9])()([A-Z①②③④])/gi, '$1×$3'],
		[/([)])()([A-Z0-9①②③④])/gi, '$1×$3'],
		[/([A-Z0-9])()([(])/gi, '$1×$3']
	/*,
		[/([A-Z])()([A-Z0-9])/gi, '$1' + Operators.Multiply.Symbol + '$3'],
		[/([A-Z0-9])()([A-Z])/gi, '$1' + Operators.Multiply.Symbol + '$3'],
		[/([)])()([A-Z0-9])/gi, '$1' + Operators.Multiply.Symbol + '$3'],
		[/([A-Z0-9])()([(])/gi, '$1' + Operators.Multiply.Symbol + '$3']
		[/[*]/gi, Operators.Multiply.Symbol],
		[/[/]/gi, Operators.Divide.Symbol],
		[/[-]/gi, Operators.Minus.Symbol],*/
	];
	patterns.forEach(function(pattern) {
		eq = eq.replace(pattern[0], pattern[1]);
	});
	return eq;
}
