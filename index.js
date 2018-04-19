"use strict";
var ConstructorOptions;
var a = function(param, fallback)
{
    if(typeof ConstructorOptions[param] !== "undefined")
    {
        return ConstructorOptions[param];
    }
    return fallback;
};
class Student
{
    constructor(options)
    {
        ConstructorOptions = options;
        this.FirstName = a("firstname", "");
        this.MiddleName = a("middlename", "");
        this.LastName = a("lastname", "");
        this.Age = a("age", -1);
        this.GradeLevel = a("grade", -1);
        this.Courses = [];
    }
}
class Course
{
    constructor(options)
    {
        ConstructorOptions = options;
        this.Name = a("name", "");
        this.Description = a("description", "");
    }
    GetInstance()
    {
        return new CourseInstance({
            name: this.Name,
            description: this.Description
        });
    }
}
class CourseInstance extends Course
{
    constructor(options)
    {
        super(options);
        //ConstructorOptions = options;
        this.Students = [];
    }
}

var CourseList = [];
var AllStudents = [];
let compSci = new Course({
    name: "Computer Science",
    description: "Where you learn how to function effectively and efficiently in modern society."
});
CourseList.push(compSci);
let stud = new Student({
    firstname: "forrest",
    age: 16,
    grade: 10
});
AllStudents.push(stud);




//something else
var findLargestNumber = function()
{
    var val = 1, amount = 1;
    while(val * 2 < Infinity)
    {
        val *= 2;
        amount *= 2;
    }

    var times = 0, tempAmount;
    while(times < 1000)
    {
        tempAmount = amount;
        while(val + tempAmount == Infinity)
        {
            tempAmount /= 2;
        }
        val += tempAmount;
        console.log("i-" + times + ": " + val);
        times++;
    }
};