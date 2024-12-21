import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { CarsCollection } from '/imports/api/cars';

export interface CustomerSeller {
    _id?: string;
    passportData: string;
    carId: string; // Reference to a car
    purchaseDate: Date;
    documentName: string;
    documentNumber: string;
    documentIssueDate: Date;
    issuedBy: string;
}

export const CustomerSellersCollection = new Mongo.Collection<CustomerSeller>('customerSellers');

Meteor.methods({
    'customerSellers.insert'(customerSeller: CustomerSeller) {
        CustomerSellersCollection.insertAsync(customerSeller);
    },

    'customerSellers.update'(id: string, updatedCustomerSeller: CustomerSeller) {
        CustomerSellersCollection.updateAsync(id, { $set: updatedCustomerSeller });
    },

    'customerSellers.remove'(id: string) {
        CustomerSellersCollection.removeAsync(id);
    },
});

if (Meteor.isServer) {
    Meteor.publish('customerSellers', function () {
        return CustomerSellersCollection.find();
    });
}
