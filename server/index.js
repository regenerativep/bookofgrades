"use strict";

const WebSocket = require("ws")
//const { Student } = require("./student.js");
const { Connection } = require("./connection.js");
const plugins = require("./plugins.js");

class Program
{
    constructor()
    {
        this.connections = [];
        this.incomingTypes = [];
        this.addIncomingType(0, function() {});
        this.addIncomingType("ready", function(data, cnnc) {
            var sendPlugins = function() {
                console.log("sending plugins");
                program.sendMessage({
                    type: 3,
                    plugins: plugins.clientPlugins
                }, cnnc);
            };
            sendPlugins();
            var interval = setInterval(function() {
                if(cnnc.hasReceivedPlugins || cnnc.socket.readyState > 1)
                {
                    clearInterval(interval);
                }
                else
                {
                    sendPlugins();
                }
            }, 2000);
        });
        this.addIncomingType("receivedPlugins", function(data, cnnc) {
            console.log("client " + cnnc.id + " has received plugins");
            cnnc.hasReceivedPlugins = true;
        })
    }
    initServer()
    {
        this.server = new WebSocket.Server({
            port: 5524,
        });
        this.server.on("connection", (function(prgm) { return function(ws) {
            var cnnc = new Connection(ws, prgm.getNextAvailableConnectionId());
            prgm.connections.push(cnnc);
            console.log("client " + cnnc.id + " connected");

            ws.on("message", function(msg) {
                var msgobj = JSON.parse(msg);
                var foundType = false;
                for(var i = 0; i < prgm.incomingTypes.length; i++)
                {
                    var inc = prgm.incomingTypes[i];
                    if(inc.type === msgobj.type)
                    {
                        inc.action(msgobj, cnnc);
                        foundType = true;
                    }
                }
                if(!foundType)
                {
                    prgm.sendMessage({
                        type: "unknownType",
                        data: msgobj
                    }, ws);
                    console.log("client " + cnnc.id + " sent an unknown message");
                }
            });
            ws.on("close", function(code, reason) {
                console.log("connection " + cnnc.id + " closed");
                prgm.removeConnection(cnnc);
            });
            ws.on("error", function(err) {
                console.log("something went wrong with client " + cnnc.id);
                console.log(err);
                prgm.removeConnection(cnnc);
            });
        }; })(this));
        this.server.on("error", function(err) {
            console.log("something went wrong with the server");
            console.log(err);
        });
        this.server.on("listening", (function(srv) { return function() {
            console.log("server is running");
            console.log(srv.address());
        }; })(this.server));
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
        if(typeof ws === "object")
        {
            ws = ws.socket;
        }
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
    getNextAvailableConnectionId()
    {
        var id = 0;
        while(this.connectionsHaveId(id))
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
