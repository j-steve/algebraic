function OperatorNode(operator) {
	'use strict';

	var side = null;

	this.parentNode = null;
	this.leftNode = null;
	this.rightNode = null; 

	/*
	var parentNode = null;
	var side = null;
	var leftNode = null;
	var rightNode = null;
	*/

	Object.defineProperty(this, 'operator', {
		configurable: false,
		get: function() {return operator;},
		set: function(value) {
			if (!(value instanceof Operator)) {throw new TypeError('Invalid type: ' + value);}
			operator = value;
		}
	});

	this._setParent = function(newParentNode, newSide) {
		this.parentNode = newParentNode;
		side = newSide;
		return this;
	}

	this.setLeaf = function(leafValue) {
		var leaf = new LeafNode(leafValue);
		if (!this.leftNode) {
			this.leftNode = leaf;
		} else if (!this.rightNode) {
			this.rightNode = leaf;
		} else {
			throw new Error('both set already');
		}
	};

	this.setChildNode = function(operator) {
		var opNode = new OperatorNode(operator);
		if (!this.leftNode) {
			this.leftNode = opNode._setParent(this, 'leftNode');
		} else if (!this.rightNode) {
			this.rightNode = opNode._setParent(this, 'rightNode');
		} else {
			if (this.parentNode) {this.parentNode[side] = opNode._setParent(this.parentNode, side);}
			opNode.leftNode = this._setParent(opNode, 'leftNode');
		}
		return opNode;
	};

	this.print = function(parentElement) {
		var newElement = document.createElement('div');
		newElement.className = 'operator-node';
		if (this.leftNode) {this.leftNode.print(newElement);}
		if (operator) {
			var operatorElement = document.createElement('div');
			operatorElement.className = 'operator';
			operatorElement.innerHTML = operator.openSymbol + operator.closeSymbol;
			newElement.appendChild(operatorElement);
		};
		if (this.rightNode) {this.rightNode.print(newElement);}
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