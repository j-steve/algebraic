/* global makeEquationTree */

function compute(equation, treeTableElement, prettyInputElement, simplifyElement, calculateElement) {
	'use strict';

	treeTableElement.innerHTML = '';
	prettyInputElement.innerHTML = '';
	simplifyElement.innerHTML = '';
	calculateElement.innerHTML = '';

	try {
		var rootNode = makeEquationTree(equation.value);

		// Output results
		treeTableElement.innerHTML = rootNode.toString();
		
		rootNode.cleanup();
		simplifyElement.className = 'treeTable';
		simplifyElement.innerHTML = rootNode.toString();
		return;
		
		//rootNode.print(treeTableElement);
		prettyInputElement.innerHTML = '<span>' + rootNode.prettyInput() + '</span>';
		rootNode.simplify();
		
		rootNode.cleanup();
		rootNode.print(simplifyElement);
		simplifyElement.className = 'treeTable';
		calculateElement.innerHTML = rootNode.calculate();
		//simplifyElement.innerHTML = rootNode.prettyInput();
	} catch (err) {
		console.warn([].slice(arguments).join(' '));
		prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	}
}
