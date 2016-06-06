
"use strict";  // Operate in Strict mode such that variables must be declared before used!


function WrappedFunction(args, source) {
    this.mArgs = args;
    this.mSource = source;
}

function WrappedFunction(source) {
    this.mArgs = [];
    this.mSource = source;
}

function WrappedFunction() {
    this.mArgs = [];
    this.mSource = new Function().toString();
}

WrappedFunction.prototype.getSource = function () {
    return this.mSource;
};

WrappedFunction.prototype.setSource = function (source) {
    this.mSource = source;
};

WrappedFunction.prototype.setArgs = function (args) {
    this.mArgs = args;
};

WrappedFunction.prototype.call = function (args) {
    var substring = this.mSource.substring(this.mSource.indexOf('{') + 2, this.mSource.lastIndexOf('}') - 1);
    var myFunction = new Function(this.mArgs, substring);
    myFunction(args);
};
