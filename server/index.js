"use strict";

const WebSocket = require("ws")
const { Student } = require("./student.js");
const { Connection } = require("./connection.js");
const plugins = require("./plugins.js");

class Program
{
    constructor()
    {
        this.connections = [];
        this.incomingTypes = [];
        this.students = [];
        this.initBasicTypes();
    }
    initBasicTypes()
    {
        this.addIncomingType(0, function() {});
        this.addIncomingType(1, function(data, ws) {
            var stdnt = new Student({
                name: data.name,
                age: data.age
            });
            this.students.push(stdnt);
            console.log("created student %s", stdnt.name);
        });
        this.addIncomingType(2, function(data, ws) {
            var stdnt = getStudent(data.name);
            this.sendMessage({
                type: 1,
                data: stdnt.getData()
            }, ws);
            console.log("sent data for student %s", stdnt.name);
        });
        this.addIncomingType(3, function(data, ws) {
            var stdnt_list = [];
            for(var i = 0; i < this.students.length; i++)
            {
                stdnt_list.push(this.students[i].getData());
            }
            this.sendMessage({
                type: 2,
                data: stdnt_list
            }, ws);
            console.log("sent all student data");
        });
    }
    initServer()
    {
        this.server = new WebSocket.Server({
            port: 5524,
        });
        this.server.on("connection", function(ws) {
            var cnnc = new Connection(ws, getNextAvailableConnectionId());
            this.connections.push(cnnc);
            console.log("client " + cnnc.id + " connected");

            sendMessage({
                type: 3,
                plugins: plugins.clientPlugins
            }, ws);

            ws.on("message", function(msg) {
                var msgobj = JSON.parse(msg);
                for(var i = 0; i < this.incomingTypes.length; i++)
                {
                    var inc = this.incomingTypes[i];
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
    addIncomingType(type, action)
    {
        this.incomingTypes.push({
            type: type,
            action: action
        });
    }
    removeConnection(cnnc)
    {
        var ind = this.connections.indexOf(cnnc);
        if(ind < 0)
        {
            return;
        }
        this.connections.splice(ind, 1);
    }
    sendMessage(msg, ws)
    {
        var sender;
        if(typeof ws === "undefined")
        {
            sender = this.server;
        }
        else
        {
            sender = ws;
        }
        if(sender.readyState != 1)
        {
            return;
        }
        if(typeof msg === "string")
        {
            sender.send(msg);
        }
        else
        {
            sender.send(JSON.stringify(msg))
        }
    }
    getStudent(name)
    {
        for(var i = 0; i < this.students.length; i++)
        {
            var stdnt = this.students[i];
            if(stdnt.name == name)
            {
                return stdnt;
            }
        }
        return null;
    }
    getNextAvailableConnectionId()
    {
        var id = 0;
        while(connectionsHaveId(id))
        {
            id++;
        }
        return id;
    }
    connectionsHaveId(id)
    {
        for(var i = 0; i < this.connections.length; i++)
        {
            if(this.connections[i].id == id)
            {
                return true;
            }
        }
        return false;
    }
}

var program = new Program();
program.initServer();
plugins.loadPlugins("plugins");
plugins.startPlugins(program);