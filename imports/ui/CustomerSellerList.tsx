import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CarsCollection } from '../api/cars';
import { CustomerSeller, CustomerSellersCollection } from "/imports/api/customerSeller";
import {Employee} from "/imports/api/employees";

export const CustomerSellerList: React.FC = () => {
    const [editingSeller, setEditingSeller] = useState<CustomerSeller | null>(null);
    const { customerSellers, cars } = useTracker(() => {
        const sellerHandle = Meteor.subscribe('customerSellers');
        const carHandle = Meteor.subscribe('cars');

        const sellersData = sellerHandle.ready() ? CustomerSellersCollection.find().fetch() : [];
        const carsData = carHandle.ready() ? CarsCollection.find().fetch() : [];

        return { customerSellers: sellersData, cars: carsData };
    }, []);

    const getCarDetails = (carId: string) => {
        const car = cars.find((car) => car._id === carId);
        return car ? `${car.brand} ${car.model}` : 'Unknown Car';
    };

    const handleEdit = (seller: CustomerSeller) => {
        setEditingSeller(seller);
    };
    const handleDelete = (seller: CustomerSeller) => {
        if (confirm(`Вы уверены, что хотите удалить объект ?`)) {
            Meteor.call('customerSeller.remove', seller._id, (error: Error) => {
                if (error) {
                    console.error('Ошибка при удалении сотрудника:', error);
                } else {
                    console.log('Сотрудник успешно удалён');
                }
            });
        }
    };

    const handleSave = () => {
        if (editingSeller && editingSeller._id) {
            Meteor.call('customerSellers.update', editingSeller._id, editingSeller);
            setEditingSeller(null);
        }
    };

    return (
        <div>
            <div className="list-container">
                {customerSellers.map((seller) => (
                    <div key={seller._id} className="list-item">
                        <h3>{getCarDetails(seller.carId)}</h3>
                        <p>Passport Data: {seller.passportData}</p>
                        <p>Purchase Date: {new Date(seller.purchaseDate).toLocaleDateString()}</p>
                        <p>Document Name: {seller.documentName}</p>
                        <p>Document Number: {seller.documentNumber}</p>
                        <p>Document Issue Date: {new Date(seller.documentIssueDate).toLocaleDateString()}</p>
                        <p>Issued By: {seller.issuedBy}</p>
                        <button onClick={() => handleEdit(seller)}>Edit</button>
                        <button onClick={() => handleDelete(seller)}>Удалить</button>
                    </div>
                ))}
            </div>

            {editingSeller && (
                <div className="form-container">
                    <h3>Edit Customer Seller</h3>
                    <input
                        type="text"
                        placeholder="Passport Data"
                        value={editingSeller.passportData}
                        onChange={(e) => setEditingSeller({ ...editingSeller, passportData: e.target.value })}
                    />
                    <input
                        type="date"
                        value={new Date(editingSeller.purchaseDate).toISOString().split('T')[0]}
                        onChange={(e) => setEditingSeller({ ...editingSeller, purchaseDate: new Date(e.target.value) })}
                    />
                    <input
                        type="text"
                        placeholder="Document Name"
                        value={editingSeller.documentName}
                        onChange={(e) => setEditingSeller({ ...editingSeller, documentName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Document Number"
                        value={editingSeller.documentNumber}
                        onChange={(e) => setEditingSeller({ ...editingSeller, documentNumber: e.target.value })}
                    />
                    <input
                        type="date"
                        value={new Date(editingSeller.documentIssueDate).toISOString().split('T')[0]}
                        onChange={(e) => setEditingSeller({ ...editingSeller, documentIssueDate: new Date(e.target.value) })}
                    />
                    <input
                        type="text"
                        placeholder="Issued By"
                        value={editingSeller.issuedBy}
                        onChange={(e) => setEditingSeller({ ...editingSeller, issuedBy: e.target.value })}
                    />
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    );
};
