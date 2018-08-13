"use strict";

const WebSocket = require("ws")
const { Student } = require("./student.js");
const { Connection } = require("./connection.js");

var server = new WebSocket.Server({
    port: 5524,
});

var students = [];
var connections = [];

server.on("connection", function(ws) {
    var cnnc = new Connection(ws, getNextAvailableConnectionId());
    connections.push(cnnc);
    console.log("client " + cnnc.id + " connected");
    ws.on("message", function(msg) {
        var msgobj = JSON.parse(msg);
        switch(msgobj.type)
        {
            case 0:
                break;
            case 1: //student creation
                var stdnt = new Student({
                    name: msgobj.name,
                    age: msgobj.age
                });
                students.push(stdnt);
                console.log("created student %s", stdnt.name);
                break;
            case 2: //student request
                var stdnt = getStudent(msgobj.name);
                sendMessage({
                    type: 1,
                    data: stdnt.getData()
                }, ws);
                console.log("sent data for student %s", stdnt.name);
                break;
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