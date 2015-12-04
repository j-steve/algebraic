var JS_NATIVE_OBJECTS = [Date, RegExp, Function, String, Number, Boolean];

function clone(cloneFrom) {
	if (cloneFrom == null || typeof cloneFrom !== "object") {  //jshint ignore:line
		return cloneFrom;
	} else if (Array.isArray(cloneFrom)) {
		return cloneFrom.map(function(x) {return clone(x);});
	} else if (JS_NATIVE_OBJECTS.indexOf(cloneFrom.constructor) !== -1) {
        return new cloneFrom.constructor(cloneFrom);
	} else {
		var result = Object.create(cloneFrom.constructor.prototype);
		//result.constructor = cloneFrom.constructor;
		for (var prop in cloneFrom) {
			result.prop = clone(cloneFrom[prop]);
		}
		return result;
	}
};

function instanceOf(target, instanceTypes) {
	if (Array.isArray(target)) {
		return target.every(function(x) {return instanceOf(x, instanceTypes);});
	} else { 
		instanceTypes = [].concat(instanceTypes || []);
		for (var i = 0; i < instanceTypes.length; i++) {
			if (target instanceof instanceTypes[i]) {return true;}
		}
		return false;
	}
}

(function() {
	
	if (!Array.prototype.includes) {
		Array.prototype.includes = function(value) {
			return this.indexOf(value) !== -1;
		};
	}
	
	Array.prototype.remove = function() {
		var removedCount = 0;
		for (var i = 0; i < arguments.length; i++) {
			var index = this.indexOf(arguments[i]);
			while (index !== -1) {
				this.splice(index, 1);
				removedCount++;
				index = this.indexOf(arguments[i]);
			}
		}
		return removedCount;
	};

	Array.prototype.peek = function() {
		return this.length ? this[this.length - 1] : false;
	};
	
	Array.prototype.sorted = function() {
		var clone = [].slice.call(this);
		[].sort.apply(clone, arguments);
		return clone;
	};
	
	Array.combos = function(a, b) {
		var combos = [];
		for (var i = 0; i < a.length; i++) {
			for (var j = 0; j < b.length; j++) { 
				combos.push([a[i], b[j]]); 
			}
		}
		return combos;
	};
	/*Array.combos = function(array) {
		var combos = [];
		for (var i = 0; i < array.length - 1; i++) {
			for (var j = i + 1; j < array.length; j++) { 
				combos.push([array[i], array[j]]); 
			}
		}
		return combos;
	};*/

	Object.extend = function(parent, child) {
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child;
		child.$super = function(self) {	
			parent.apply(self, [].slice.call(arguments, 1));
			var $super = {};
			for (var key in self) {
				if (self.hasOwnProperty(key)) {
					$super[key] = self[key];
				}
			}
			return $super;
		};
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