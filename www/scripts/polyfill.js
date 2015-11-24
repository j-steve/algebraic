(function() {
	'use strict';

	Array.prototype.peek = function() {
		return this.length ? this[this.length - 1] : false;
	};
	
	Array.prototype.sorted = function() {
		var clone = [].slice.call(this);
		[].sort.apply(clone, arguments);
		return clone;
	};

	Object.extend = function(parent, child) {
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child; 
	};
	
	/*Object.iterate = function(target, callback, thisContext) {
		Object.keys(target).forEach(function(key) {
			callback.call(thisContext, target[key], key, target);
		});
	};*/

	Object.prototype.toArray = function() {
		var self = this;
		return Object.keys(self).map(function(key) {
			return self[key];
		});
	};
	 
    /**
     * The pattern for matching parseMessage replacements, e.g. "{0}", "{1}", etc.
     *
     * @type {RegEx}
     */
    var PARSE_MSG_REGEX = /{(\d+)}/;

    /**
     * Parses through the passed String looking for place holders (i.e.: {0} ). When it finds a placeholder it
     * looks for a corresponding extra argument passed to the method. If it finds one, it replaces every
     * instance of the place holder with the String value of the passed argument. Otherwise it will remove the
     * place holder.
     *
     * @param {string} message - the message to parse.
     * @param {...Object} replacements - the items to use for replacing the place holders.
     * @returns {string} - the modified String.
     */
	String.format = function(message) {
        if (typeof message === 'string') { 
            for (var match; match = PARSE_MSG_REGEX.exec(message);) { //jshint ignore:line
                var index = parseInt(match[1]) + 1;
                var replaceVal = index < arguments.length ? arguments[index] : '';
                message = message.replace(match[0], replaceVal);
            }
        }
        return message;
    };

})();