import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { CarsCollection } from '/imports/api/cars';

export interface CustomerBuyer {
    _id?: string;
    passportData: string;
    carId: string; // Reference to a car
    saleDate: Date;
    invoiceNumber: string;
    paymentType: string;
}

export const CustomerBuyersCollection = new Mongo.Collection<CustomerBuyer>('customerBuyers');

Meteor.methods({
    'customerBuyers.insert'(customerBuyer: CustomerBuyer) {
        CustomerBuyersCollection.insertAsync(customerBuyer);
    },

    'customerBuyers.update'(id: string, updatedCustomerBuyer: CustomerBuyer) {
        CustomerBuyersCollection.updateAsync(id, { $set: updatedCustomerBuyer });
    },

    'customerBuyers.remove'(id: string) {
        CustomerBuyersCollection.remove(id);
    },
});

if (Meteor.isServer) {
    Meteor.publish('customerBuyers', function () {
        return CustomerBuyersCollection.find();
    });
}
