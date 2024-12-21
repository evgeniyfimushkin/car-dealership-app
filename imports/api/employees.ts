import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export interface Employee {
    _id: string; // Обязательное поле для обновления
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
        check(employee, Object); // Проверка данных на типы
        EmployeesCollection.insert(employee);
    },

    'employees.update'(id: string, updatedEmployee: Employee) {
        check(id, String); // Проверка id
        check(updatedEmployee, Object); // Проверка обновленных данных


        EmployeesCollection.updateAsync(id, { $set: updatedEmployee });

    },

    'employees.remove'(id: string) {
        check(id, String); // Проверка id
        EmployeesCollection.remove(id);
    },
});

if (Meteor.isServer) {
    Meteor.publish('employees', function () {
        return EmployeesCollection.find();
    });
}
