"use strict";
const HTTP = require("http");
const Express = require("express");
var program;
var server;
var port;
var start = function(prgm)
{
    program = prgm;
    startServer(8080);
};
var startServer = function(p)
{
    port = p;
    server = Express();
    server.use("/", Express.static("public"));
    server.listen(port, (function(port) { return function() {
        console.log("http server running on port " + port);
    }; })(port));
};
var getData = function()
{
    return {
        name: "httpserver",
        version: "0.0.1"
    };
};

/*  this.start(program: Program): void
    - starts the http server
    this.getData(): object
    - gets the data of this plugin
*/
exports.start = start;
exports.getData = getData;