"use strict";
var program;

var Program = (function() {
    /*  this.main: object
        - contains information on the tab elements and content
        this.incomingTypes: object array
        - contains a list on all of the possible types of data that can be received, along with what to do when the type is received
        this.plugins: object array
        - contains a list of all of the (client-side) plugins
        this.socket: WebSocket
        - the websocket used to communicate with the server
        this.switchTab(name: string): void
        - switches current tab to the tab under the given name
        this.setupNavItem(name: string, part: object): void
        - sets up event listeners for the nav button
        this.addTab(name: string): html element
        - creates a new tab with empty content, and returns the content element
        this.addNavItem(name: string): html element
        - creates and returns a new tab nav button
        this.addContentItem(name: string): html element
        - creates and returns a new tab content area
        this.initBasicTypes(): void
        - creates the basic incoming types
        this.loadPlugin(plugin: object): void
        - loads a single plugin
        this.startPlugins(): void
        - starts all of the loaded plugins
        this.addIncomingtype(type: any, action: function(data)): void
        - adds a new incoming type to this.incomingTypes
        this.connect(address: string("ws://*")): void
        - connects to the server at the specified address
    */
    function Program()
    {
        this.main = {
            names: ["home"],
            navbar: {},
            content: {
                container: document.getElementById("content"),
            }
        };
        this.loadNavbar();
        this.incomingTypes = [];
        this.initBasicTypes();
        this.plugins = [];
    }
    Program.prototype.switchTab = function(name)
    {
        for(var i = 0; i < this.main.names.length; i++)
        {
            var iname = this.main.names[i];
            var disp = "none",
                bgCol = "transparent",
                sel = false;
            if(name === iname)
            {
                disp = "block";
                bgCol = "rgb(82,82,82)";
                sel = true;
            }
            this.main.navbar[iname].style.backgroundColor = bgCol;
            this.main.navbar[iname].selected = sel;
            this.main.content[iname].style.display = disp;
        }
    };
    Program.prototype.setupNavItem = function(name, part)
    {
        var item = part.navbar[name];
        item.addEventListener("click", (function(name, part, prgm) { return function() {
            prgm.switchTab(name);
        }; })(name, part, this));
        item.addEventListener("mouseover", (function(name, part) { return function() {
            if(!item.selected)
            {
                item.style.backgroundColor = "rgb(82,82,82)";
            }
        }; })(name, part));
        item.addEventListener("mouseout", (function(name, part) { return function() {
            if(!item.selected)
            {
                item.style.backgroundColor = "transparent";
            }
        }; })(name, part));
    };
    Program.prototype.addTab = function(name)
    {
        var navelement = this.addNavItem(name);
        var contentelement = this.addContentItem(name);
        this.setupNavItem(name, this.main);
        return contentelement;
    };
    Program.prototype.addNavItem = function(name)
    {
        this.main.names.push(name);
        var navelement = document.createElement("div");
        navelement.classList.add("navitem");
        navelement.id = "nav_" + name;
        var navelement_text = document.createElement("p");
        navelement_text.classList.add("noselect");
        navelement_text.innerHTML = name;
        navelement.appendChild(navelement_text);
        document.getElementById("navbar").appendChild(navelement);
        this.main.navbar[name] = navelement;
        return navelement;
    };
    Program.prototype.addContentItem = function(name)
    {
        var contentelement = document.createElement("div");
        contentelement.id = "tab_" + name;
        contentelement.style.display = "none";
        document.getElementById("content").appendChild(contentelement);
        this.main.content[name] = contentelement;
        return contentelement;
    };
    Program.prototype.initBasicTypes = function()
    {
        this.addIncomingType(0, function() {});
        this.addIncomingType(3, (function(prgm) { return function(data) { //plugins
            console.log("loading plugins..");
            for(var i = 0; i < data.plugins.length; i++)
            {
                prgm.loadPlugin(data.plugins[i]);
            }
            prgm.sendMessage({
                type: "receivedPlugins"
            });
            prgm.startPlugins();
        }; })(this));
    };
    Program.prototype.loadPlugin = function(plugin)
    {
        plugin.plugin = eval(plugin.plugin);
        this.plugins.push(plugin);
    };
    Program.prototype.startPlugins = function()
    {
        for(var i = 0; i < this.plugins.length; i++)
        {
            var plg = this.plugins[i];
            console.log("starting plugin " + plg.name);
            plg.plugin.start(this);
        }
    };
    Program.prototype.addIncomingType = function(type, action)
    {
        this.incomingTypes.push({
            type: type,
            action: action
        });
    };
    Program.prototype.connect = function(addr)
    {
        this.socket = new WebSocket(addr);
        this.socket.onopen = (function(prgm) { return function(ev) {
            prgm.socket.onmessage = function(ev) {
                var msgobj = JSON.parse(ev.data);
                for(var i = 0; i < prgm.incomingTypes.length; i++)
                {
                    var inc = prgm.incomingTypes[i];
                    if(inc.type === msgobj.type)
                    {
                        inc.action(msgobj);
                        break;
                    }
                }
                console.log(msgobj);
            };
            prgm.sendMessage({
                type: "ready"
            });
        }; })(this);
    };
    Program.prototype.sendMessage = function(msg)
    {
        if(this.socket.readyState != 1)
        {
            return;
        }
        if(typeof msg == "string")
        {
            this.socket.send(msg);
        }
        else
        {
            this.socket.send(JSON.stringify(msg))
        }
    };
    Program.prototype.loadNavbar = function()
    {
        var main = this.main;
        for(var i = 0; i < main.names.length; i++)
        {
            var name = main.names[i];
            main.navbar[name] = document.getElementById("nav_" + name);
            main.content[name] = document.getElementById("tab_" + name);
            this.setupNavItem(name, main);
        }
        if(main.names.length > 0)
        {
            main.navbar[main.names[0]].click();
        }
    };
    return Program;
}());

window.addEventListener("load", function() {
    program = new Program();
    program.connect("ws://127.0.0.1:5524");
});