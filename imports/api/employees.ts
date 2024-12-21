import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import {Meteor} from "meteor/meteor";

export interface Employee {
    _id?: string;
    firstName: string;
    lastName: string;
    address?: string;
    birthDate: Date;
    position: string;
    salary: number;
    transfers?: {
        position: string;
        reason?: string;
        orderNumber?: string;
        orderDate?: Date;
    }[];
}

export const EmployeesCollection = new Mongo.Collection<Employee>('employees');

Meteor.methods({
    'employees.insert'(employee: Employee) {

        EmployeesCollection.insertAsync(employee);
    },

    'employees.update'(id: string, updatedEmployee: Employee) {
        // check(id, String);
        // check(updatedEmployee, Object);
        EmployeesCollection.updateAsync(id, { $set: updatedEmployee });
    },

    'employees.remove'(id: string) {
        // check(id, String);
        EmployeesCollection.remove(id);
    },
});

if (Meteor.isServer) {
    Meteor.publish('employees', function () {
        return EmployeesCollection.find();
    });
}
