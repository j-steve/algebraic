define(['./makeEquationTree'], function(makeEquationTree) {
	
	// Attach to the DOM Loaded event handler.
	if (['interactive', 'complete', 'loaded'].includes(document.readyState)) {
		attachEquationInputHandler();
	} else {
		document.addEventListener("DOMContentLoaded", function(event) {
			attachEquationInputHandler();
		});
	}
	
	/**
	 * Attaches the updateDisplay method to the equation textbox input. 
	 */
	function attachEquationInputHandler() {
		var equationEl = document.getElementById('equation');
		var ouputEl = document.getElementById('output');
		
		// Trigger once to populate initial values.
		updateDisplay(equationEl.value, ouputEl); 
		
		// Bind to input event.
		equationEl.oninput = function() {
			updateDisplay(equationEl.value, ouputEl);
		};
	}

	/** 
	 * Updates the output display when the equation textbox changes.
	 * 
	 * @param {string} equation
	 * @param {Node} outputEl
	 */
	function updateDisplay(equation, outputEl) {
		'use strict';
		clearElement(outputEl);
		try {
			var rootNode = makeEquationTree(equation);

			// Output results
			rootNode.print(addOutputElement(outputEl, 'Input Structure:', null, 'treeTable'));
			addOutputElement(outputEl, 'Formatted Input:', '<span>' + rootNode.prettyInput() + '</span>');
			
			rootNode.simplify();
			rootNode.cleanup();
			
			rootNode.print(addOutputElement(outputEl, 'Result (Structure):', null, 'treeTable'));
			addOutputElement(outputEl, 'Result Calculated:', rootNode.calculate());
		} catch (err) {
			addOutputElement(outputEl, 'Error:', '<span style="color:red; font-size:80%;">' + err.message + '</span>');
		}
	}
	
	/**
	 * Removes all child nodes from the given DOM element.
	 * 
	 * @param {Node} containerEl
	 */
	function clearElement(containerEl) {
		while (containerEl.firstChild) { // clear output element
			containerEl.removeChild(containerEl.firstChild);
		}
	}
	
	/**
	 * Creates a label-wrapped output DOM element.
	 * 
	 * @param {Node} containerEl
	 * @param {string} label
	 * @param {string} [output]
	 * @param {string} [className]
	 * @returns {Node}
	 */
	function addOutputElement(containerEl, label, output, className) {
		var lblEl = document.createElement('label');
		var spanEl = document.createElement('span');
		spanEl.appendChild(document.createTextNode(label));
		lblEl.appendChild(spanEl);
		containerEl.appendChild(lblEl);
		var outputEl = document.createElement('output');
		if (className) {outputEl.className = className;}
		if (output) {outputEl.appendChild(document.createTextNode(output));}
		containerEl.appendChild(outputEl);
		return outputEl;
	}
	
});
