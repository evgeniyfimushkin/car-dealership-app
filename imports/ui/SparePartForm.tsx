import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { CarsCollection } from '../api/cars'; // Car collection

export const SparePartForm: React.FC = () => {
    const [sparePart, setSparePart] = useState<any>({});
    const [cars, setCars] = useState<any[]>([]);

    // Fetch available cars for selection
    useEffect(() => {
        Meteor.subscribe('cars');
        const handle = CarsCollection.find().observe({
            added: (doc) => setCars((prev) => [...prev, doc]),
            removed: (doc) => setCars((prev) => prev.filter((car) => car._id !== doc._id)),
        });
        return () => handle.stop();
    }, []);

    const handleChange = (field: string, value: any) => {
        setSparePart({ ...sparePart, [field]: value });
    };

    const handleSubmit = () => {
        Meteor.call('spareParts.insert', sparePart, (err: Error) => {
            if (err) {
                alert(`Error: ${err.message}`);
            } else {
                alert('Spare Part Added');
            }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input
                type="text"
                placeholder="Spare Part Name"
                onChange={(e) => handleChange('name', e.target.value)}
            />
            <input
                type="text"
                placeholder="Car Model"
                onChange={(e) => handleChange('carModel', e.target.value)}
            />
            <input
                type="number"
                placeholder="Price"
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            />
            <input
                type="number"
                placeholder="Quantity in Stock"
                onChange={(e) => handleChange('quantityInStock', parseInt(e.target.value))}
            />

            <div>
                <h4>Select a Car:</h4>
                <select onChange={(e) => handleChange('carId', e.target.value)}>
                    <option value="">Select a Car</option>
                    {cars.map((car) => (
                        <option key={car._id} value={car._id}>
                            {car.brand} {car.model}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">Add Spare Part</button>
        </form>
    );
};
