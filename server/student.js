"use strict";
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
exports.Student = Student;