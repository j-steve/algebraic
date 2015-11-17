function OperatorNode(operator) {
	'use strict';
	
	var self = this;

	var side = null;

	this.parentNode = null;
	this.leftNode = null;
	this.rightNode = null;

	Object.defineProperty(this, 'operator', {
		configurable: false,
		get: function() {return operator;},
		set: function(value) {
			if (!(value instanceof Operator)) {throw new TypeError('Invalid type: ' + value);}
			operator = value;
		}
	});

	this._setParent = function(newParentNode, newSide) {
		self.parentNode = newParentNode;
		side = newSide;
		return self;
	}

	this.setLeaf = function(leafValue) {
		var leaf = new LeafNode(leafValue);
		if (!self.leftNode) {
			self.leftNode = leaf;
		} else if (!self.rightNode) {
			self.rightNode = leaf;
		} else {
			throw new Error('both set already');
		}
	};

	this.addChildNode = function(operator) {
		var opNode = new OperatorNode(operator);
		var emptySide = ['leftNode', 'rightNode'].find(function(s) {return !self[s];})
		if (emptySide) {
			self[emptySide] = opNode._setParent(self, emptySide);
		} else {
			if (self.parentNode) {self.parentNode[side] = opNode._setParent(self.parentNode, side);}
			opNode.leftNode = self._setParent(opNode, 'leftNode');
		}
		return opNode;
	};

	this.replaceChildNode = function(operator) {
		var occupiedSide = ['rightNode', 'leftNode'].find(function(s) {return !!self[s];})
		if (!occupiedSide) {throw new Error('No nodes to replace.');}
		var opNode = new OperatorNode(operator);
		opNode.leftNode = self[occupiedSide];
		return self[occupiedSide] = opNode._setParent(self, occupiedSide);
	};

	this.print = function(parentElement) {
		var newElement = document.createElement('div');
		newElement.className = 'operator-node';
		if (self.leftNode) {self.leftNode.print(newElement);}
		if (operator) {
			var operatorElement = document.createElement('div');
			operatorElement.className = 'operator';
			operatorElement.innerHTML = operator.debugSymbol;
			newElement.appendChild(operatorElement);
		};
		if (self.rightNode) {self.rightNode.print(newElement);}
		parentElement.appendChild(newElement);
	};

	Object.seal(this);
}


function LeafNode(value) {
	'use strict';

	this._parentNode = null;

	Object.defineProperty(this, 'parentNode', {
		get: function() {return this._parentNode;}
	});

	Object.defineProperty(this, 'value', {
		get: function() {return value;}
	});

	this.print = function(parentElement) { 
		var newElement = document.createElement('div');
		newElement.className = 'leaf-node';
		newElement.innerHTML += this.value;
		parentElement.appendChild(newElement);
	}

	Object.seal(this);
};