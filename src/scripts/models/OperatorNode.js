function OperatorNode(operator, leftNode, rightNode) {
	'use strict';

	this._parentNode = null;

	Object.defineProperty(this, 'parentNode', {
		get: function() {return this._parentNode;}/*,
		set: function(value) {
			if (parentNode) {parentNode.parentNode = null;}
			leftNode = value;
			leftNode.parentNode = this;
		}*/
	});

	Object.defineProperty(this, 'leftNode', {
		get: function() {return leftNode;},
		set: function(value) {
			//if (rightNode && rightNode.parentNode === this) {rightNode.parentNode = null;}
			if (value) {value._parentNode = this;}
			leftNode = value;
		}
	});

	Object.defineProperty(this, 'rightNode', {
		get: function() {return rightNode;},
		set: function(value) {
			//if (rightNode && rightNode.parentNode === this) {rightNode.parentNode = null;}
			if (value) {value._parentNode = this;}
			rightNode = value; 
		}
	});
 
	this.operator = operator;
	this.leftNode = leftNode;
	this.rightNode = rightNode;

	this.print = function(parentElement) {
		var newElement = document.createElement('div');
		newElement.className = 'operator-node';
		if (this.leftNode) {this.leftNode.print(newElement);}
		if (this.operator) {
			var operatorElement = document.createElement('div');
			operatorElement.className = 'operator';
			operatorElement.innerHTML = this.operator.openSymbol;
			newElement.appendChild(operatorElement);
		};
		if (this.rightNode) {this.rightNode.print(newElement);}
		parentElement.appendChild(newElement);
	};
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

};