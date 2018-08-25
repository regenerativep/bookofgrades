
var Students = (function() {
    function Students()
    {

    }
    Students.prototype.start = function(program)
    {
        program.addIncomingType("receiveStudent", function(data) {
            var stdnt_data = msgobj.data;
            this.displayStudent(stdnt_data);
        });

        this.content = program.addTab("students");
        this.generatePage();
    };
    Students.prototype.displayStudent = function(stdnt)
    {
        this.getstudent.container.innerText = "name: " + stdnt.name + ", age: " + stdnt.age;
    };
    Students.prototype.generatePage = function()
    {
        this.titleelement = document.createElement("p");
        this.titleelement.classList.add("tabtitle");
        this.titleelement.innerText = "Students";
        this.getstudent = {
            container: document.createElement("div"),
            nameinput: document.createElement("input"),
            getbutton: document.createElement("input")
        };
        this.getstudent.nameinput.type = "text";
        this.getstudent.nameinput.placeholder = "full name";
        this.getstudent.getbutton.type = "button";
        this.getstudent.getbutton.value = "get student";
        var plg = this;
        this.getstudent.getbutton.addEventListener("click", function() {
            plg.getStudent(plg.getstudent.nameinput.value);
            plg.getstudent.nameinput.value = "";
        });


        this.content.appendChild(this.titleelement);
        this.content.appendChild(this.getstudent.container);
        this.content.appendChild(this.getstudent.nameinput);
        this.content.appendChild(this.getstudent.getbutton);
    };
    Students.prototype.getStudent = function(name)
    {
        program.sendMessage({
            type: "getStudent",
            name: name
        });
    };
    return Students;
}());
new Students();