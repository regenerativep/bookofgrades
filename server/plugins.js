"use strict";
const FS = require("fs");
const PATH = require("path");

var plugins = [];
var clientPlugins = [];

var isDirectory = function(src)
{
    return FS.lstatSync(src).isDirectory();
};
var getDirectories = function(src) //https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
{
    return FS.readdirSync(src).map(function(name) {
        return PATH.join(src, name);
    }).filter(isDirectory);
};
var getFile = function(fname)
{
    try
    {
        return FS.readFileSync(fname, "utf8");
    }
    catch(e)
    {
        return "";
    }
};
var loadPlugin = function(dir)
{
    var serverDir = dir + "/server.js";
    var clientDir = dir + "/client.js";
    if(FS.existsSync(serverDir))
    {
        var plugin;
        try
        {
            plugin = require(serverDir);
        }
        catch(e)
        {
            console.log("failed to load plugin at " + serverDir);
            console.log(e);
            return;
        }
        if(typeof plugin.getData === "function")
        {
            var plugindata = plugin.getData();
            plugins.push({
                name: plugindata.name,
                version: plugindata.version,
                plugin: plugin
            });
            var clientPlugin = getFile(clientDir); //we're sending the file so that the client can run it
            if(clientPlugin.length !== 0)
            {
                clientPlugins.push({
                    name: plugindata.name,
                    version: plugindata.version,
                    plugin: clientPlugin
                });
            }
        }
        else
        {
            console.log("no getData function on " + serverDir);
            return;
        }
    }
};
var loadPlugins = function(pluginDirectory)
{
    var dirs = getDirectories(pluginDirectory);
    for(var i = 0; i < dirs.length; i++)
    {
        var dir = "./" + dirs[i].replace("\\", "/"); //dont know if this is dependent on OS or what, but for it to work i need forward slash
        loadPlugin(dir);
    }
};
var startPlugins = function(prgm)
{
    for(var i = 0; i < plugins.length; i++)
    {
        var plg = plugins[i];
        if(typeof plg.plugin.start === "function")
        {
            console.log("starting " + plg.name);
            plg.plugin.start(prgm);
        }
        else
        {
            console.log(plg.name + " has no start function, cannot start");
            continue;
        }
    }
};

/*  this.plugins: object array
    - contains a list of all of the server-side plugins
    this.clientPlugins: object array
    - contains a list of all of the client-side plugins
    this.loadPlugins(directory: string): void
    - loads all of the plugins inside the given directory
    this.loadPlugin(directory: string): void
    - loads the plugin inside the given directory
    this.startPlugins(program: Program): void
    - starts the plugins with a reference to the program
*/

exports.loadPlugin = loadPlugin;
exports.loadPlugins = loadPlugins;
exports.startPlugins = startPlugins;
exports.clientPlugins = clientPlugins;
exports.plugins = plugins;