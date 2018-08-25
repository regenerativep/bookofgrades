"use strict";
var program;

var Program = (function() {
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
        item.addEventListener("click", (function(name, part, program) { return function() {
            program.switchTab(name);
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
        this.addIncomingType(0, function() {});/*
        this.addIncomingType(1, function(data) { //singular student data
            var stdnt_data = msgobj.data;
            console.log(stdnt_data);
        });
        this.addIncomingType(2, function(data) { //list of student data
            var stdnts = msgobj.data;
            console.log(stdnts);
            //do something here
        });*/
        this.addIncomingType(3, function(data) { //plugins
            console.log("loading plugins..");
            for(var i = 0; i < data.plugins.length; i++)
            {
                program.loadPlugin(data.plugins[i]);
            }
            program.sendMessage({
                type: "receivedPlugins"
            });
            program.startPlugins();
        });
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
            plg.plugin.start(program);
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
        this.socket.onopen = function(ev) {
            program.socket.onmessage = function(ev) {
                var msgobj = JSON.parse(ev.data);
                for(var i = 0; i < program.incomingTypes.length; i++)
                {
                    var inc = program.incomingTypes[i];
                    if(inc.type === msgobj.type)
                    {
                        inc.action(msgobj);
                        break;
                    }
                }
                console.log(msgobj);
            };
            program.sendMessage({
                type: "ready"
            });
        };
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
    Program.prototype.loadStudentTab = function()
    {
        //todo make better
        this.student = {
            names: ["create", "get", "list"],
            create: {
                name: document.getElementById("stdnt_cname"),
                age: document.getElementById("stdnt_age"),
                button: document.getElementById("stdnt_create")
            },
            get: {
                name: document.getElementById("stdnt_gname"),
                button: document.getElementById("stdnt_get")
            },
            navbar: {},
            content: {
                container: document.getElementById("stdnt_content")
            }
        };
        this.loadNavbar("stdnt_", this.student);
        
        this.student.create.button.addEventListener("click", function() {
            var name = this.student.create.name.value,
                age = parseInt(this.student.create.age.value);
            this.student.create.name.value = "";
            this.student.create.age.value = "";
            this.sendMessage({
                type: 1,
                name: name,
                age: age
            });
        });
        this.student.get.button.addEventListener("click", function() {
            var name = this.student.get.name.value;
            this.student.get.name.value = "";
            this.sendMessage({
                type: 2,
                name: name
            });
        });
    };
    return Program;
}());

window.addEventListener("load", function() {
    program = new Program();
    program.connect("ws://127.0.0.1:5524");
});