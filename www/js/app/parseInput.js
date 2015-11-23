define(
	['./operators/Operators', './nodes/LeafNode'],
	function(Operators, LeafNode) {
		
		/**
		 * @param {type} substring
		 * @returns {ParseInputResult}
		 */
		function parseInput(substring) {
			/* jshint boss: false */
			var match = null; 

			if (match = /^,\s*|^\(/.exec(substring)) { // jshint ignore:line
				return new ParseInputResult(match, 'OPEN-PAREN');
			}

			if (match = /^\)/.exec(substring)) { // jshint ignore:line
				return new ParseInputResult(match, 'CLOSE-PAREN'); 
			}

			for (var opKey in Operators) {
				if (Operators.hasOwnProperty(opKey) && Operators[opKey].regex) {
					if (match = Operators[opKey].regex.exec(substring)) {  // jshint ignore:line
						return new ParseInputResult(match, Operators[opKey]);
					}

				}
			}

			if (match = /^[0-9]+|^[A-Za-z]/.exec(substring)) { // jshint ignore:line
				return new ParseInputResult(match, new LeafNode(match[0])); 
			}

			return new ParseInputResult(['1'], 'BAD_CHAR');
		}

		/**
		 * @constructor
		 * 
		 * @param {Array} match
		 * @param {Operator|*} type 
		 */
		function ParseInputResult(match, type) {

			/** @type {string} */
			this.match = match[0];

			/** @type {Operator|*} */
			this.type = type;
		}
		
		return parseInput;
	}
);