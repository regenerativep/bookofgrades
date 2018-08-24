"use strict";
const HTTP = require("http");
var program;
var server;
var start = function(program)
{
    this.program = program;
    startServer();
};
var startServer = function()
{
    //todo
};
var getData = function()
{
    return {
        name: "httpserver",
        version: "0.0.1"
    };
};

exports.start = start;
exports.getData = getData;
