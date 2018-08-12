"use strict";
class Connection
{
    constructor(ws, id)
    {
        this.socket = ws;
        this.id = id;
    }
}
exports.Connection = Connection;