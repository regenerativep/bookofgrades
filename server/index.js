"use strict";

const WebSocket = require("ws")
const { Student } = require("./student.js");
const { Connection } = require("./connection.js");
const Plugins = require("./plugins.js");

var server;

var students = [];
var connections = [];
var incomingTypes = [];
var properties = [];

var startingProperties = [
    {
        name: "server",
        prop: function() { return server; }
    },
    {
        name: "connections",
        prop: function() { return connections; }
    },
    {
        name: "students",
        prop: function() { return students; }
    },
    {
        name: "incomingTypes",
        prop: function() { return incomingTypes; }
    },
    {
        name: "properties",
        prop: function() { return properties; }
    },
    {
        name: "removeConnection",
        prop: function() { return removeConnection; }
    },
    {
        name: "sendMessage",
        prop: function() { return sendMessage; }
    },
    {
        name: "getStudent",
        prop: function() { return getStudent; }
    },
    {
        name: "getNextAvailableConnectionId",
        prop: function() { return getNextAvailableConnectionId; }
    },
    {
        name: "connectionsHaveId",
        prop: function() { return connectionsHaveId; }
    },
    {
        name: "addIncomingType",
        prop: function() { return addIncomingType; }
    },
    {
        name: "addIndexObjectProperty",
        prop: function() { return addIndexObjectProperty; }
    },
    {
        name: "getIndexObject",
        prop: function() { return getIndexObject; }
    }
];
for(var i = 0; i < startingProperties.length; i++)
{
    var prop = startingProperties[i];
    addIndexObjectProperty(prop.name, prop.prop);
}

addIncomingType(0, function() {});
addIncomingType(1, function(data, ws) {
    var stdnt = new Student({
        name: data.name,
        age: data.age
    });
    students.push(stdnt);
    console.log("created student %s", stdnt.name);
});
addIncomingType(2, function(data, ws) {
    var stdnt = getStudent(data.name);
    sendMessage({
        type: 1,
        data: stdnt.getData()
    }, ws);
    console.log("sent data for student %s", stdnt.name);
});
addIncomingType(3, function(data, ws) {
    var stdnt_list = [];
    for(var i = 0; i < students.length; i++)
    {
        stdnt_list.push(students[i].getData());
    }
    sendMessage({
        type: 2,
        data: stdnt_list
    }, ws);
    console.log("sent all student data");
});


function initServer()
{
    server = new WebSocket.Server({
        port: 5524,
    });
    server.on("connection", function(ws) {
        var cnnc = new Connection(ws, getNextAvailableConnectionId());
        connections.push(cnnc);
        console.log("client " + cnnc.id + " connected");
        ws.on("message", function(msg) {
            var msgobj = JSON.parse(msg);
            for(var i = 0; i < incomingTypes.length; i++)
            {
                var inc = incomingTypes[i];
                if(inc.type === msgobj.type)
                {
                    inc.action(msgobj, ws);
                    break;
                }
            }
        });
        ws.on("close", function(code, reason) {
            console.log("connection " + cnnc.id + " closed");
            removeConnection(cnnc);
        });
        ws.on("error", function(err) {
            console.log("something went wrong with client " + cnnc.id);
            console.log(err);
            removeConnection(cnnc);
        });
    });
    server.on("error", function(err) {
        console.log("something went wrong with the server");
        console.log(err);
    });
    server.on("listening", function() {
        console.log("server is running");
        console.log(server.address());
    });
}
function removeConnection(cnnc)
{
    var ind = connections.indexOf(cnnc);
    if(ind < 0)
    {
        return;
    }
    connections.splice(ind, 1);
}
function sendMessage(msg, ws)
{
    var sender;
    if(typeof ws === "undefined")
    {
        sender = server;
    }
    else
    {
        sender = ws;
    }
    if(sender.readyState != 1)
    {
        return;
    }
    if(typeof msg == "string")
    {
        sender.send(msg);
    }
    else
    {
        sender.send(JSON.stringify(msg))
    }
}
function getStudent(name)
{
    for(var i = 0; i < students.length; i++)
    {
        var stdnt = students[i];
        if(stdnt.name == name)
        {
            return stdnt;
        }
    }
    return null;
}
function getNextAvailableConnectionId()
{
    var id = 0;
    while(connectionsHaveId(id))
    {
        id++;
    }
    return id;
}
function connectionsHaveId(id)
{
    for(var i = 0; i < connections.length; i++)
    {
        if(connections[i].id == id)
        {
            return true;
        }
    }
    return false;
}
function addIncomingType(type, action)
{
    incomingTypes.push({
        type: type,
        action: action
    });
}
function addIndexObjectProperty(name, prop)
{
    properties.push({
        name: name,
        property: prop
    });
}
function getIndexObject()
{
    var obj = {};
    for(var i = 0; i < properties.length; i++)
    {
        var prop = properties[i];
        if(typeof prop.property === "function")
        {
            obj[prop.name] = prop.property();
        }
        else
        {
            obj[prop.name] = this[prop.property];
        }
    }
    return obj;
}

initServer();
Plugins.loadPlugins("plugins");
Plugins.startPlugins(getIndexObject);