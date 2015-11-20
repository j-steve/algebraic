
/**
 * The constructors properities for {@link Operator}.
 * 
 * @typedef {Object} OperatorProps
 * @property {RegExp} regex   the match pattern to identify an operator in an equation
 * @property {number} tightness   how tightly bound an operator is to its value, e.g., its rank in the order of operations heirchy
 * @property {Function simplify
 * @property {Function} calculate
 * @property {string} [openSymbol]
 * @property {string} [closeSymbol]
 * @property {string} [debugSymbol]
 * @property {boolean} [rightToLeft]   if {@code true}, this operator is evaluated right-to-left rather than left-to-right, as with exponenents
 */

/**
 * An Operator represents a mathmmatical function that may be performed on numbers or symbols,<br>
 * including things like multiplication, division, logarithms, and exponents.
 * 
 * @constructor
 * @extends OperatorProps
 * 
 * @param {OperatorProps} prop
 */
function Operator(prop) {
	'use strict';

	var self = this;

	// ================================================================================
	// Read-Only Properties
	// ================================================================================

	Object.defineProperty(this, 'regex', {
		get: function () {
			return prop.regex;
		}
	});

	Object.defineProperty(this, 'tightness', {
		get: function () {
			return prop.tightness;
		},
		set: function(value) {
			prop.tightness = value;
		}
	});

	Object.defineProperty(this, 'openSymbol', {
		get: function () {
			return prop.openSymbol || '';
		}
	});

	Object.defineProperty(this, 'closeSymbol', {
		get: function () {
			return prop.closeSymbol || '';
		}
	});

	Object.defineProperty(this, 'debugSymbol', {
		get: function () {
			return prop.debugSymbol || this.openSymbol + this.closeSymbol;
		}
	});

	Object.defineProperty(this, 'rightToLeft', {
		get: function () {
			return !!prop.rightToLeft;
		}
	});

	// ================================================================================
	// Methods
	// ================================================================================

	this.isTighterThan = function (otherOperator) {
		var effectiveTightness = self.tightness + (prop.rightToLeft ? 0.5 : 0);
		return effectiveTightness > otherOperator.tightness;
	};

	this.simplify = function (a, b) {
		return prop.simplify ? prop.simplify.call(self, a, b) : null;
	};

	this.calculate = function (a, b) {
		return prop.calculate ? prop.calculate.call(self, a, b) : null;
	};

	// ================================================================================
	// Initialization
	// ================================================================================

	Object.seal(this);
}