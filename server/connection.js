"use strict";
class Connection
{
    constructor(ws, id)
    {
        this.socket = ws;
        this.id = id;
        this.hasReceivedPlugins = false;
    }
}
exports.Connection = Connection;