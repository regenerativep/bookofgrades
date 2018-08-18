var Socket;
var Main;
//var StudentGet, StudentCreate, Navbar, Content;
var Student, Home, Classes;
function Connect(addr)
{
    Socket = new WebSocket(addr)
    Socket.onopen = function(ev) {
        Socket.onmessage = function(ev) {
            var msgobj = JSON.parse(ev.data);
            switch(msgobj.type)
            {
                case 0:
                    break;
                case 1: //student information
                    stdnt_data = msgobj.data;
                    break;
                case 2: //list of all student data
                    stdnts = msgobj.data;
                    
                    break;
            }
        };
    };
}
function SendMessage(msg)
{
    if(Socket.readyState != 1)
    {
        return;
    }
    if(typeof msg == "string")
    {
        Socket.send(msg);
    }
    else
    {
        Socket.send(JSON.stringify(msg))
    }
}
function loadNavbar(pre, part)
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
}
function loadStudentTab()
{
    //todo make better
    Student = {
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
    loadNavbar("stdnt_", Student);
    
    Student.create.button.addEventListener("click", function() {
        var name = Student.create.name.value,
            age = parseInt(Student.create.age.value);
        Student.create.name.value = "";
        Student.create.age.value = "";
        SendMessage({
            type: 1,
            name: name,
            age: age
        });
    });
    Student.get.button.addEventListener("click", function() {
        var name = Student.get.name.value;
        Student.get.name.value = "";
        SendMessage({
            type: 2,
            name: name
        });
    });
}
window.addEventListener("load", function() {
    Main = {
        names: ["home", "students", "classes"],
        navbar: {},
        content: {
            container: document.getElementById("content"),
        }
    };
    loadNavbar("", Main);

    loadStudentTab();
    
    Connect("ws://127.0.0.1:5524");
});