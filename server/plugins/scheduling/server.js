"use strict";

var program, classes, schedulePlg;
var start = function(prgm)
{
    program = prgm;
    classes = [];
    schedulePlg = this;
    program.addIncomingType("createClass", function(data, cnnc) {
        var clss = schedulePlg.createClass(data.name);
        console.log(cnnc.id + " created class " + clss.name);
    });
    program.addIncomingType("getClass", function(data, cnnc) {
        var clss = schedulePlg.getClass(data.name);
        program.sendMessage({
            type: "receiveClass",
            data: clss
        }, cnnc);
        console.log(cnnc.id + " requested data for class " + clss.name);
    });
    program.addIncomingType("getClassList", function(data, cnnc) {
        program.sendMessage({
            type: "receiveClassList",
            data: classes
        }, cnnc);
        console.log("sent all classes to " + cnnc.id);
    });
};
var getData = function()
{
    return {
        name: "scheduling",
        version: "0.0.1"
    };
};
var getClass = function(name)
{
    for(var i = 0; i < classes.length; i++)
    {
        var clss = classes[i];
        if(clss.name == name)
        {
            return clss;
        }
    }
    console.log("failed to find the class under the name of \"" + name + "\"");
    console.log(classes);
    return null;
};
var createClass = function(name)
{
    var clss = {
        name: name
    };
    classes.push(clss);
    return clss;
};