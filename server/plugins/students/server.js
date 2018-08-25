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

var program, students, stdntPlg;
var start = function(prgm)
{
    program = prgm;
    students = [];
    
    stdntPlg = this;
    program.addIncomingType("createStudent", function(data, cnnc) {
        var stdnt = new Student({
            name: data.name,
            age: data.age
        });
        students.push(stdnt);
        console.log(cnnc.id + " created student %s", stdnt.name);
    });
    program.addIncomingType("getStudent", function(data, cnnc) {
        var stdnt = getStudent(data.name);
        program.sendMessage({
            type: "receiveStudent",
            data: stdnt.getData()
        }, cnnc);
        console.log(cnnc.id + " sent data for student %s", stdnt.name);
    });
    program.addIncomingType("getStudentList", function(data, cnnc) {
        var stdnt_list = [];
        for(var i = 0; i < students.length; i++)
        {
            stdnt_list.push(students[i].getData());
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

exports.start = start;
exports.getData = getData;
exports.getStudent = getStudent;
exports.students = students;