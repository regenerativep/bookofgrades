"use strict";
var getIndexObject;
var start = function(gIO)
{
    getIndexObject = gIO;
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