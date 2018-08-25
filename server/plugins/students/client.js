
var Students = (function() {
    function Students()
    {

    }
    Students.prototype.start = function(program)
    {
        var plg = this;
        program.addIncomingType("receiveStudent", function(data) {
            var stdnt_data = data.data;
            plg.displayStudent(stdnt_data);
        });
        this.content = program.addTab("students");
        this.generatePage();
    };
    Students.prototype.displayStudent = function(stdnt)
    {
        this.getStudentSection.container.innerText = "name: " + stdnt.name + ", age: " + stdnt.age;
    };
    Students.prototype.generatePage = function()
    {
        this.titleElement = document.createElement("p");
        this.titleElement.classList.add("tabtitle");
        this.titleElement.innerText = "Students";
        this.getStudentSection = {
            container: document.createElement("div"),
            nameInput: document.createElement("input"),
            getButton: document.createElement("input")
        };
        this.getStudentSection.nameInput.type = "text";
        this.getStudentSection.nameInput.placeholder = "full name";
        this.getStudentSection.getButton.type = "button";
        this.getStudentSection.getButton.value = "get student";
        var plg = this;
        this.getStudentSection.getButton.addEventListener("click", function() {
            plg.getStudent(plg.getStudentSection.nameInput.value);
            plg.getStudentSection.nameInput.value = "";
        });

        this.createStudentSection = {
            nameInput: document.createElement("input"),
            ageInput: document.createElement("input"),
            createButton: document.createElement("input")
        };
        this.createStudentSection.nameInput.type = "text";
        this.createStudentSection.nameInput.placeholder = "full name";
        this.createStudentSection.ageInput.type = "text";
        this.createStudentSection.ageInput.placeholder = "age";
        this.createStudentSection.createButton.type = "button";
        this.createStudentSection.createButton.value = "create student";
        this.createStudentSection.createButton.addEventListener("click", function() {
            var data = {
                type: "createStudent",
                name: plg.createStudentSection.nameInput.value,
                age: parseInt(plg.createStudentSection.ageInput.value)
            };
            plg.createStudentSection.nameInput.value = "";
            plg.createStudentSection.ageInput.value = "";
            program.sendMessage(data);
        });

        var addBreak = function() {
            plg.content.appendChild(document.createElement("br"));
        };
        this.content.appendChild(this.titleElement);
        this.content.appendChild(this.getStudentSection.container);
        this.content.appendChild(this.getStudentSection.nameInput);
        this.content.appendChild(this.getStudentSection.getButton);
        addBreak();
        addBreak();
        this.content.appendChild(this.createStudentSection.nameInput);
        addBreak();
        this.content.appendChild(this.createStudentSection.ageInput);
        this.content.appendChild(this.createStudentSection.createButton);
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