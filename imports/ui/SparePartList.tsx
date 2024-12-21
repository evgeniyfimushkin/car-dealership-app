import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CarsCollection } from '../api/cars';
import { SparePartsCollection } from "/imports/api/sparePart";

export const SparePartList: React.FC = () => {
    const [spareParts, setSpareParts] = useState<any[]>([]);
    const [editingSparePart, setEditingSparePart] = useState<any | null>(null);

    // Fetch cars and spare parts using useTracker
    const { cars, sparePartsData } = useTracker(() => {
        const carHandle = Meteor.subscribe('cars');
        const sparePartsHandle = Meteor.subscribe('spareParts');

        const carsData = carHandle.ready() ? CarsCollection.find().fetch() : [];
        const sparePartsData = sparePartsHandle.ready() ? SparePartsCollection.find().fetch() : [];

        return {
            cars: carsData,
            sparePartsData,
        };
    }, []);

    // Helper function to get car details
    const getCarDetails = (carId: string) => {
        const car = cars.find((car) => car._id === carId);
        return car ? `${car.brand} ${car.model}` : 'Unknown Car';
    };

    useEffect(() => {
        setSpareParts(sparePartsData);
    }, [sparePartsData]); // This will update the spareParts state when sparePartsData changes.

    // Handle editing a spare part
    const handleEdit = (sparePart: any) => {
        setEditingSparePart(sparePart);
    };

    const handleChange = (field: string, value: any) => {
        setEditingSparePart((prev: any) => (prev ? { ...prev, [field]: value } : null));
    };

    const handleSave = () => {
        if (editingSparePart && editingSparePart._id) {
            // Call the method to update the spare part through Meteor.call
            Meteor.call('spareParts.update', editingSparePart._id, editingSparePart, (error: Error) => {
                if (error) {
                    console.error('Error updating spare part:', error);
                } else {
                    console.log('Spare part updated successfully');
                }
            });

            setEditingSparePart(null); // Close the edit form
        }
    };

    return (
        <div>
            <h2>Spare Parts List</h2>
            <div className="list-container">
                {spareParts.map((part) => (
                    <div key={part._id} className="list-item">
                        <h3>{part.name}</h3>
                        <p>Car: {getCarDetails(part.carId)}</p>
                        <p>Price: {part.price}</p>
                        <p>Quantity in Stock: {part.quantityInStock}</p>
                        <button onClick={() => handleEdit(part)}>Edit</button>
                    </div>
                ))}
            </div>

            {editingSparePart && (
                <div className="form-container">
                    <h3>Edit Spare Part</h3>
                    <input
                        type="text"
                        placeholder="Spare Part Name"
                        value={editingSparePart.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={editingSparePart.price}
                        onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Quantity in Stock"
                        value={editingSparePart.quantityInStock}
                        onChange={(e) => handleChange('quantityInStock', parseInt(e.target.value))}
                    />
                    <div>
                        <h4>Select a Car:</h4>
                        <select
                            value={editingSparePart.carId}
                            onChange={(e) => handleChange('carId', e.target.value)}
                        >
                            <option value="">Select a Car</option>
                            {cars.map((car) => (
                                <option key={car._id} value={car._id}>
                                    {car.brand} {car.model}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingSparePart(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};
