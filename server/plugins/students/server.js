"use strict";
var program, students, stdntPlg;
var start = function(prgm)
{
    program = prgm;
    students = [];
    
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