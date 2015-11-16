function compute(equation, prettyInput, output) {
	eq = [].slice.call(formatEquation(equation.value));
	
	//prettyInput.innerHTML = '';
	var output = '';
	
	var scope = new Scope();
	for (var i = 0; i < eq.length; i++) {
		var thisChar = eq[i];
		var lastNode = scope.nodes.peek();
		if (thisChar === '(') {
			scope = new Scope(scope);
			output += scope.open();
		} else if (thisChar === ')') {
			if (scope.isRoot) {return error(prettyInput, 'Unmatched ")" at position {0}.', i + 1);}
			output += scope.close();
			scope = scope.parentScope;
		} else if (/[0-9]/.test(thisChar) && lastNode instanceof NumberValue) {
			lastNode.value += thisChar;
			output += thisChar;
		} else if (NUMERIC_CHARS.test(thisChar) || /[A-Z]/i.test(thisChar)) {
			if (lastNode instanceof Value) {
			}
			output += thisChar;
		} else {
			var op = Operators.all.find(function(operator) {return operator.match(thisChar);});
			if (!op) {return error(prettyInput, 'Invalid character: "{0}" at position {1}.', thisChar, i + 1);}
			while (scope.nodes.peek() && scope.nodes.peek().tightness > op.tightness) {
				output += scope.nodes.pop().close();
			}

			output += op.open();
			scope.nodes.push(op);
		} 
	}
	while (scope) {
		output += scope.close();
		scope = scope.parentScope;
	}
	prettyInput.innerHTML = output;
	
	//prettyInput.innerHTML = ops.map(function(op) {op.close(); return typeof op === 'string' ? op : op.render();}).join('');
	//prettyInput.innerHTML = eq.join('');
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
