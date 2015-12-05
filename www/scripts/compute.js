/* global EquationTreeParser */

/*
 * TODO: make these work:
 *	->	(4+2)/4
 *	->	543/2x+3=100
 *	->	5/4*2
 */

function compute(equation, treeTableElement, prettyInputElement, simplifyElement, calculateElement) {
	treeTableElement.innerHTML = '';
	prettyInputElement.innerHTML = '';
	simplifyElement.innerHTML = '';
	calculateElement.innerHTML = '';

	//try {
		var rootNode = new EquationTree(equation.value);

		// Output results
		treeTableElement.innerHTML = rootNode.toString();
		
		prettyInputElement.className = 'formatted';
		prettyInputElement.innerHTML = rootNode.toString(); 
		
		rootNode.simplify();
		rootNode.cleanup(); 
		
		simplifyElement.className = 'treeTable';
		simplifyElement.innerHTML = rootNode.toString();
		
		calculateElement.className = 'formatted result';
		calculateElement.innerHTML = rootNode.toString();
		
	//} catch (err) {
		//console.warn([].slice(arguments).join(' '));
		//prettyInputElement.innerHTML = '<span style="color:red; font-size:80%;">' + err.message + '</span>';
	//}
}
