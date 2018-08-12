var Socket;
var StudentAgeInput, StudentCreateNameInput, StudentCreateButton;
var StudentGetNameInput, StudentGetButton;
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
    StudentCreateNameInput = document.getElementById("stdnt_cname");
    StudentAgeInput = document.getElementById("stdnt_age");
    StudentCreateButton = document.getElementById("stdnt_create");
    StudentCreateButton.addEventListener("click", function() {
        var name = StudentCreateNameInput.value,
            age = parseInt(StudentAgeInput.value);
        SendMessage({
            type: 1,
            name: name,
            age: age
        });
    });
    StudentGetNameInput = document.getElementById("stdnt_gname");
    StudentGetButton = document.getElementById("stdnt_get");
    StudentGetButton.addEventListener("click", function() {
        var name = StudentGetNameInput.value;
        SendMessage({
            type: 2,
            name: name
        });
    });
    Connect("ws://127.0.0.1:5524");
});