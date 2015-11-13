function compute(equation, formattedInput, prettyInput) {
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
			output += scope.close();
			scope = scope.parentScope;
		} else if (/[0-9]/.test(thisChar) && lastNode instanceof NumberValue) {
			lastNode.value += thisChar;
			output += thisChar;
		} else if (/[0-9]/.test(thisChar) || /[A-Z]/i.test(thisChar)) {
			if (lastNode instanceof Value) {
			}
			output += thisChar;
		} else {
			var op = Operators.all.find(function(operator) {return operator.match(thisChar);});
			if (!op) {prettyInput.innerHTML = String.format('Unknown character "{0}".', thisChar); return;}
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

function formatEquation(eq) {
	eq = eq.trim();
	
	var patterns = [
		[/([A-Z])()([A-Z0-9])/gi, '$1*$3'],
		[/([A-Z0-9])()([A-Z])/gi, '$1*$3'],
		[/([)])()([A-Z0-9])/gi, '$1*$3'],
		[/([A-Z0-9])()([(])/gi, '$1*$3']
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
