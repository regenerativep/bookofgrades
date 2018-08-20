"use strict";
var program;

class Student
{
    constructor(props)
    {
        this.name = props.name;
        this.age = props.age;
    }
    getData()
    {
        return {
            name: this.name,
            age: this.age
        };
    }
}

var start = function(program)
{
    this.program = program;
    this.students = [];
    
    var stdntPlg = this;
    program.addIncomingType("createStudent", function(data, ws) {
        var stdnt = new Student({
            name: data.name,
            age: data.age
        });
        stdntPlg.students.push(stdnt);
        console.log("created student %s", stdnt.name);
    });
    program.addIncomingType("getStudent", function(data, ws) {
        var stdnt = getStudent(data.name);
        program.sendMessage({
            type: 1,
            data: stdnt.getData()
        }, ws);
        console.log("sent data for student %s", stdnt.name);
    });
    program.addIncomingType("getStudentList", function(data, ws) {
        var stdnt_list = [];
        for(var i = 0; i < stdntPlg.students.length; i++)
        {
            stdnt_list.push(stdntPlg.students[i].getData());
        }
        program.sendMessage({
            type: 2,
            data: stdnt_list
        }, ws);
        console.log("sent all student data");
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
    for(var i = 0; i < this.students.length; i++)
    {
        var stdnt = this.students[i];
        if(stdnt.name == name)
        {
            return stdnt;
        }
    }
    return null;
}

exports.start = start;
exports.getData = getData;
exports.getStudent = getStudent;
