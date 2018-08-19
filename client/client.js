"use strict";
var program;

var Program = (function() {
    function Program()
    {
        this.main = {
            names: ["home", "students", "classes"],
            navbar: {},
            content: {
                container: document.getElementById("content"),
            }
        };
        this.loadNavbar("", this.main);
        this.loadStudentTab();
        this.incomingTypes = [];
        this.initBasicTypes();
        this.plugins = [];
    }
    Program.prototype.initBasicTypes = function()
    {
        this.addIncomingType(0, function() {});
        this.addIncomingType(1, function(data) { //singular student data
            var stdnt_data = msgobj.data;
            console.log(stdnt_data);
        });
        this.addIncomingType(2, function(data) { //list of student data
            var stdnts = msgobj.data;
            console.log(stdnts);
            //do something here
        });
        this.addIncomingType(3, function(data) { //plugins
            console.log("loading plugins..");
            for(var i = 0; i < data.plugins.length; i++)
            {
                program.loadPlugin(data.plugins[i]);
            }
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
            this.plugins[i].plugin.start();
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
    Program.prototype.loadNavbar = function(pre, part)
    {
        for(var i = 0; i < part.names.length; i++)
        {
            var name = part.names[i];
            part.navbar[name] = document.getElementById(pre + "nav_" + name);
            part.content[name] = document.getElementById(pre + "tab_" + name);
    
            part.navbar[name].addEventListener("click", (function(name) { return function() {
                for(var j = 0; j < part.names.length; j++)
                {
                    if(part.names[j] !== name)
                    {
                        part.content[part.names[j]].style.display = "none";
                        part.navbar[part.names[j]].style.backgroundColor = "transparent";
                    }
                }
                part.content[name].style.display = "block";
                part.navbar[name].style.backgroundColor = "rgb(82, 82, 82)"
            }; })(name));
        }
        if(part.names.length > 0)
        {
            part.navbar[part.names[0]].click();
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