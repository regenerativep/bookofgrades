"use strict";
const FS = require("fs");
const PATH = require("path");

//maybe create a module to require for these functions?
var isDirectory = function(src)
{
    return FS.lstatSync(src).isDirectory();
};
var getDirectories = function(src)
{
    return FS.readdirSync(src).map(function(name) {
        return PATH.join(src, name);
    }).filter(isDirectory);
};
var getFile = function(fname)
{
    try
    {
        return FS.readFileSync(fname, "utf8");
    }
    catch(e)
    {
        return "";
    }
};

var studentsDir = "students.json";
var studentSaveInterval = 30000;
var program, students, stdntPlg;
var start = function(prgm)
{
    program = prgm;
    students = [];
    loadStudents();
    setInterval(function() {
        saveStudents();
    }, studentSaveInterval);

    stdntPlg = this;
    program.addIncomingType("createStudent", function(data, cnnc) {
        var stdnt = stdntPlg.createStudent(data.name, data.age);
        console.log(cnnc.id + " created student %s", stdnt.name);
    });
    program.addIncomingType("getStudent", function(data, cnnc) {
        var stdnt = getStudent(data.name);
        program.sendMessage({
            type: "receiveStudent",
            data: stdnt
        }, cnnc);
        console.log(cnnc.id + " sent data for student %s", stdnt.name);
    });
    program.addIncomingType("getStudentList", function(data, cnnc) {
        var stdnt_list = [];
        for(var i = 0; i < students.length; i++)
        {
            stdnt_list.push(students[i]);
        }
        program.sendMessage({
            type: "receiveList",
            data: stdnt_list
        }, cnnc);
        console.log("sent all student data to " + cnnc.id);
    });
};
var getData = function()
{
    return {
        name: "students",
        version: "0.0.1"
    };
};
var getStudent = function(name)
{
    for(var i = 0; i < students.length; i++)
    {
        var stdnt = students[i];
        if(stdnt.name == name)
        {
            return stdnt;
        }
    }
    console.log("failed to find student \"" + name + "\"");
    console.log(students);
    return null;
};
var createStudent = function(name, age)
{
    var stdnt = {
        name: name,
        age: age
    };
    students.push(stdnt);
    return stdnt;
};
var saveStudents = function()
{
    var stdnts = JSON.stringify({students: students});
    FS.writeFile(studentsDir, stdnts, function(err) {
        if(err)
        {
            console.log("failed to save students");
            console.log(stdnts);
            console.log(err);
        }
        else
        {
            console.log("saved students to " + studentsDir);
        }
    });
};
var loadStudents = function()
{
    if(FS.existsSync(studentsDir))
    {
        var studentsFile = getFile(studentsDir);
        students = JSON.parse(studentsFile).students;
    }
    else
    {
        console.log("no students file");
    }
};

/*  this.students: object array
    - a list of all of the students
    this.start(program: Program): void
    - starts the students plugin
    this.getData(): object
    - returns the plugin information for this plugin
    this.getStudent(name: string): object
    - find the student from the given name
    this.createStudent(name: string, age: int): object
    - creates a student given a name and an age for the student
*/

exports.start = start;
exports.getData = getData;
exports.getStudent = getStudent;
exports.createStudent = createStudent;
exports.students = students;