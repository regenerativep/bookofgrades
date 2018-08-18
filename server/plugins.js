"use strict";
const FS = require("fs");
const PATH = require("path");


var plugins = [];

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
var loadPlugin = function(name)
{

};
var loadPlugins = function(pluginDirectory)
{
    var dirs = getDirectories(pluginDirectory);
    for(var i = 0; i < dirs.length; i++)
    {
        var dir = "./" + dirs[i].replace("\\", "/") + "/server.js";
        if(FS.existsSync(dir))
        {
            var plugin;
            try
            {
                plugin = require(dir);
            }
            catch
            {
                console.log("failed to load plugin at " + dir);
                continue;
            }
            if(typeof plugin.getData === "function")
            {
                var plugindata = plugin.getData();
                var obj = {
                    name: plugindata.name,
                    version: plugindata.version,
                    plugin: plugin
                };
                plugins.push(obj);
            }
            else
            {
                console.log("failed to get plugin data at " + dir);
                continue;
            }
        }
    }
};
var startPlugins = function(getIndexObject)
{
    for(var i = 0; i < plugins.length; i++)
    {
        var plg = plugins[i];
        if(typeof plg.plugin.start === "function")
        {
            console.log("starting " + plg.name);
            plg.plugin.start(getIndexObject);
        }
        else
        {
            console.log(plg.name + " has no start function, cannot start");
            continue;
        }
    }
};

exports.loadPlugin = loadPlugin;
exports.loadPlugins = loadPlugins;
exports.startPlugins = startPlugins;