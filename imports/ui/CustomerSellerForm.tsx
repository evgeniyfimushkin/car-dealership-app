import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { CarsCollection } from '../api/cars';
import { CustomerSeller } from "/imports/api/customerSeller";

export const CustomerSellerForm: React.FC = () => {
    const [seller, setSeller] = useState<Partial<CustomerSeller>>({});
    const [cars, setCars] = useState<any[]>([]);

    useEffect(() => {
        Meteor.subscribe('cars');
        const handle = CarsCollection.find().observe({
            added: (doc) => setCars((prev) => [...prev, doc]),
            removed: (doc) => setCars((prev) => prev.filter((car) => car._id !== doc._id)),
        });
        return () => handle.stop();
    }, []);

    const handleChange = (field: keyof CustomerSeller, value: any) => {
        setSeller({ ...seller, [field]: value });
    };

    const handleSubmit = () => {
        Meteor.call('customerSellers.insert', seller, (err: Error) => {
            if (err) {
                alert(`Error: ${err.message}`);
            } else {
                alert('Customer Seller Added');
            }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input
                type="text"
                placeholder="Passport Data"
                onChange={(e) => handleChange('passportData', e.target.value)}
            />
            <input
                type="date"
                onChange={(e) => handleChange('saleDate', new Date(e.target.value))}
            />
            <input
                type="text"
                placeholder="Invoice Number"
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            />
            <input
                type="text"
                placeholder="Payment Type"
                onChange={(e) => handleChange('paymentType', e.target.value)}
            />
            <div>
                <h4>Choose a Car:</h4>
                {cars.map((car) => (
                    <button
                        key={car._id}
                        onClick={() => handleChange('carId', car._id!)}
                        style={{
                            margin: '5px',
                            padding: '10px',
                            backgroundColor: seller.carId === car._id ? 'lightblue' : '',
                        }}
                    >
                        {car.brand} {car.model}
                    </button>
                ))}
            </div>
            <button type="submit">Add Customer Seller</button>
        </form>
    );
};
