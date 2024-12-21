import React, { useEffect, useState } from 'react';
import { CarsCollection, Car } from '../api/cars';
import { EmployeesCollection, Employee } from '../api/employees';
import { useNavigate } from 'react-router-dom';
export const CarList: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        Meteor.subscribe('cars');
        Meteor.subscribe('employees');

        const carsHandle = CarsCollection.find().observe({
            added: (doc) => setCars((prev) => [...prev, doc]),
            removed: (doc) => setCars((prev) => prev.filter((car) => car._id !== doc._id)),
        });

        const employeesHandle = EmployeesCollection.find().observe({
            added: (doc) => setEmployees((prev) => [...prev, doc]),
            removed: (doc) => setEmployees((prev) => prev.filter((emp) => emp._id !== doc._id)),
        });

        return () => {
            carsHandle.stop();
            employeesHandle.stop();
        };
    }, []);

    const getEmployeeName = (employeeId: string) => {
        const employee = employees.find((emp) => emp._id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
    };

    return (
        <div className="list-container">
            {cars.map((car) => (
                <div className="list-item" key={car._id}>
                    <h3>{car.brand} {car.model}</h3>
                    <p>Color: {car.color || 'N/A'}</p>
                    <p>Engine Number: {car.engineNumber || 'N/A'}</p>
                    <p>Registration Number: {car.registrationNumber || 'N/A'}</p>
                    <p>Body Number: {car.bodyNumber || 'N/A'}</p>
                    <p>Chassis Number: {car.chassisNumber || 'N/A'}</p>
                    <p>Manufacture
                        Date: {car.manufactureDate ? new Date(car.manufactureDate).toLocaleDateString() : 'N/A'}</p>
                    <p>Mileage: {car.mileage !== undefined ? car.mileage : 'N/A'}</p>
                    <p>Release Price: {car.releasePrice !== undefined ? `$${car.releasePrice.toFixed(2)}` : 'N/A'}</p>
                    <p>Sale Price: {car.salePrice !== undefined ? `$${car.salePrice.toFixed(2)}` : 'N/A'}</p>
                    <p>Purchase
                        Price: {car.purchasePrice !== undefined ? `$${car.purchasePrice.toFixed(2)}` : 'N/A'}</p>
                    <p>Assigned to: {getEmployeeName(car.employeeId || '')}</p>
                </div>
            ))}
        </div>

    );
};
