import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CarsCollection } from '../api/cars';
import { CustomerBuyer, CustomerBuyersCollection } from "/imports/api/customerBuyer";

export const CustomerBuyerList: React.FC = () => {
    const [editingBuyer, setEditingBuyer] = useState<CustomerBuyer | null>(null);
    const { customerBuyers, cars } = useTracker(() => {
        const buyerHandle = Meteor.subscribe('customerBuyers');
        const carHandle = Meteor.subscribe('cars');

        const buyersData = buyerHandle.ready() ? CustomerBuyersCollection.find().fetch() : [];
        const carsData = carHandle.ready() ? CarsCollection.find().fetch() : [];

        return { customerBuyers: buyersData, cars: carsData };
    }, []);

    const getCarDetails = (carId: string) => {
        const car = cars.find((car) => car._id === carId);
        return car ? `${car.brand} ${car.model}` : 'Unknown Car';
    };

    const handleEdit = (buyer: CustomerBuyer) => {
        setEditingBuyer(buyer);
    };

    const handleSave = () => {
        if (editingBuyer && editingBuyer._id) {
            Meteor.call('customerBuyers.update', editingBuyer._id, editingBuyer);
            setEditingBuyer(null);
        }
    };

    const handleCarSelection = (carId: string) => {
        if (editingBuyer) {
            setEditingBuyer({ ...editingBuyer, carId });
        }
    };

    return (
        <div>
            <div className="list-container">
                {customerBuyers.map((buyer) => (
                    <div key={buyer._id} className="list-item">
                        <h3>{getCarDetails(buyer.carId)}</h3>
                        <p>Passport Data: {buyer.passportData}</p>
                        <p>Sale Date: {new Date(buyer.saleDate).toLocaleDateString()}</p>
                        <p>Invoice Number: {buyer.invoiceNumber}</p>
                        <p>Payment Type: {buyer.paymentType}</p>
                        <button onClick={() => handleEdit(buyer)}>Edit</button>
                    </div>
                ))}
            </div>

            {editingBuyer && (
                <div className="form-container">
                    <h3>Edit Customer Buyer</h3>
                    <input
                        type="text"
                        placeholder="Passport Data"
                        value={editingBuyer.passportData}
                        onChange={(e) => setEditingBuyer({ ...editingBuyer, passportData: e.target.value })}
                    />
                    <input
                        type="date"
                        value={new Date(editingBuyer.saleDate).toISOString().split('T')[0]}
                        onChange={(e) => setEditingBuyer({ ...editingBuyer, saleDate: new Date(e.target.value) })}
                    />
                    <input
                        type="text"
                        placeholder="Invoice Number"
                        value={editingBuyer.invoiceNumber}
                        onChange={(e) => setEditingBuyer({ ...editingBuyer, invoiceNumber: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Payment Type"
                        value={editingBuyer.paymentType}
                        onChange={(e) => setEditingBuyer({ ...editingBuyer, paymentType: e.target.value })}
                    />

                    {/* Car Selection */}
                    <div>
                        <h4>Choose a Car:</h4>
                        {cars.map((car) => (
                            <button
                                key={car._id}
                                onClick={() => handleCarSelection(car._id!)}
                                style={{
                                    margin: '5px',
                                    padding: '10px',
                                    backgroundColor: editingBuyer.carId === car._id ? 'lightblue' : '',
                                }}
                            >
                                {car.brand} {car.model}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    );
};
