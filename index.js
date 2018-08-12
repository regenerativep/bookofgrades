"use strict";

const WebSocket = require("ws")

var Server = new WebSocket.Server({
    port: 5524,
});

Server.on("connection", function(ws) {
    ws.on("message", function(msg) {
        var msgobj = JSON.parse(msg);
        switch(msgobj.type)
        {
            case 0:
                break;
        }
    });

});
function SendMessage(msg)
{
    if(Server.readyState != 1)
    {
        return;
    }
    if(typeof msg == "string")
    {
        Server.send(msg);
    }
    else
    {
        Server.send(JSON.stringify(msg))
    }
}