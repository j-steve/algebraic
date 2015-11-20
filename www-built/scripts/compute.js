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
		rootNode.print(treeTableElement);
		prettyInputElement.innerHTML = '<span>' + rootNode.prettyInput() + '</span>';
		simplifyElement.innerHTML = rootNode.simplify();
		calculateElement.innerHTML = rootNode.calculate();
	} catch (err) {
		prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	}
}
