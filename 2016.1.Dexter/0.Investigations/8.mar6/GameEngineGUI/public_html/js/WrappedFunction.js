
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function WrappedFunction(args, source) {
    this.mArgs = args;
    this.mSource = source;
    this.mFunction = new Function(this.mArgs, this.mSource);
}

function WrappedFunction(source) {
    this.mArgs = [];
    this.mSource = source;
    this.mFunction = new Function(this.mArgs, this.mSource);
}

WrappedFunction.prototype.setSource = function (source) {
    this.mSource = source;
    this.mFunction = new Function(this.mArgs, this.mSource);
};

WrappedFunction.prototype.setArgs = function (args) {
    this.mArgs = args;
    this.mFunction = new Function(this.mArgs, this.mSource);
};

WrappedFunction.prototype.call = function (args) {
    this.mFunction(args);
};
