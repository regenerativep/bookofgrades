
var Students = (function() {
    function Students()
    {

    }
    Students.prototype.start = function(program)
    {
        this.content = program.addTab("students");
        
    };
    Students.prototype.generatePage = function()
    {
        var titleelement = document.createElement("p");
        textelement.classList.add("tabtitle");
        textelement.innerText = "Students";
        this.content.appendChild(textelement);
    };
    return Students;
}());
new Students();