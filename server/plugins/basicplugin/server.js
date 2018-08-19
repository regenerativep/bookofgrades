"use strict";
var program;
var start = function(program)
{
    this.program = program;
};
var getData = function()
{
    return {
        name: "basicplugin",
        version: "0.0.1"
    };
};

exports.start = start;
exports.getData = getData;