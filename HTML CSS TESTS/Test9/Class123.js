function Class123() {
	this.mName = "Bob";
};

Class123.prototype.hello = function() {
	alert("Hello, I am " + this.mName + " from Class123!");
};