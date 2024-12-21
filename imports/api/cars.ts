import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {Meteor} from "meteor/meteor";
import {EmployeesCollection} from "/imports/api/employees";

export interface Car {
    _id?: string;
    brand: string;
    model: string;
    color?: string;
    engineNumber?: string;
    registrationNumber?: string;
    bodyNumber?: string;
    chassisNumber?: string;
    manufactureDate?: Date;
    mileage?: number;
    releasePrice?: number;
    salePrice?: number;
    purchasePrice?: number;
    employeeId?: string;
}

export const CarsCollection = new Mongo.Collection<Car>('cars');

Meteor.methods({
    'cars.insert'(car: Car) {
        CarsCollection.insertAsync(car);
    },

    'cars.update'(id: string, updatedCar: Car) {
        CarsCollection.updateAsync(id, { $set: updatedCar });
    },

    'cars.remove'(id: string) {
        CarsCollection.removeAsync(id);
    },
});

if (Meteor.isServer) {
    Meteor.publish('cars', function () {
        return CarsCollection.find();
    });
}
