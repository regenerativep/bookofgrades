
var Students = (function() {
    function Students()
    {

    }
    Students.prototype.start = function(program)
    {
        this.content = program.addTab("students");
        this.content.innerHTM = "hello there";
    };
    return Students;
}());
new Students();