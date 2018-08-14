var Socket;
var StudentGet, StudentCreate, Navbar, Content;
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
                    console.log(stdnt_data);
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
window.addEventListener("load", function() {
    StudentCreate = {
        name: document.getElementById("stdnt_cname"),
        age: document.getElementById("stdnt_age"),
        button: document.getElementById("stdnt_create")
    };
    StudentCreate.button.addEventListener("click", function() {
        var name = StudentCreate.name.value,
            age = parseInt(StudentCreate.age.value);
        SendMessage({
            type: 1,
            name: name,
            age: age
        });
    });
    StudentGet = {
        name: document.getElementById("stdnt_gname"),
        button: document.getElementById("stdnt_get")
    };
    StudentGet.button.addEventListener("click", function() {
        var name = StudentGet.name.value;
        SendMessage({
            type: 2,
            name: name
        });
    });
    Navbar = {
        home: document.getElementById("nav_home"),
        students: document.getElementById("nav_students"),
        classes: document.getElementById("nav_classes")
    };
    var names = ["students", "home", "classes"];
    Content = {
        container: document.getElementById("content"),
        students: document.getElementById("tab_students"),
        home: document.getElementById("tab_home"),
        classes: document.getElementById("tab_classes")
    };
    function resetContent()
    {
        for(var i = 0; i < names.length; i++)
        {
            Content[names[i]].style.display = "none";
        }
    }
    Navbar.home.addEventListener("click", function() {
        resetContent();
        Content.home.style.display = "block";
    });
    Navbar.students.addEventListener("click", function() {
        resetContent();
        Content.students.style.display = "block";
    });
    Navbar.classes.addEventListener("click", function() {
        resetContent();
        Content.classes.style.display = "block";
    });
    Connect("ws://127.0.0.1:5524");
});