import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Car } from '../api/cars';
import { EmployeesCollection, Employee } from '../api/employees';

export const CarForm: React.FC = () => {
    const [car, setCar] = useState<Partial<Car>>({});
    const [employees, setEmployees] = useState<Employee[]>([]);

    // Получение списка сотрудников
    useEffect(() => {
        Meteor.subscribe('employees');
        const handle = EmployeesCollection.find().observe({
            added: (doc) => setEmployees((prev) => [...prev, doc]),
            removed: (doc) => setEmployees((prev) => prev.filter((emp) => emp._id !== doc._id)),
        });
        return () => handle.stop();
    }, []);

    const handleChange = (field: keyof Car, value: string | number) => {
        setCar({ ...car, [field]: value });
    };

    const handleSubmit = () => {
        Meteor.call('cars.insert', car, (err: Error) => {
            if (err) {
                alert(`Ошибка: ${err.message}`);
            } else {
                alert('Машина добавлена');
            }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input
                type="text"
                placeholder="Марка"
                onChange={(e) => handleChange('brand', e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Модель"
                onChange={(e) => handleChange('model', e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Цвет"
                onChange={(e) => handleChange('color', e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Номер двигателя"
                onChange={(e) => handleChange('engineNumber', e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Регистрационный номер"
                onChange={(e) => handleChange('registrationNumber', e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Номер кузова"
                onChange={(e) => handleChange('bodyNumber', e.target.value)}
            /><br/>
            <input
                type="text"
                placeholder="Номер шасси"
                onChange={(e) => handleChange('chassisNumber', e.target.value)}
            /><br/>
            <input
                type="date"
                placeholder="Дата производства"
                onChange={(e) => handleChange('manufactureDate', new Date(e.target.value))}
            /><br/>
            <input
                type="number"
                placeholder="Пробег"
                onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
            /><br/>
            <input
                type="number"
                placeholder="Цена выпуска"
                onChange={(e) => handleChange('releasePrice', parseFloat(e.target.value))}
            /><br/>
            <input
                type="number"
                placeholder="Цена продажи"
                onChange={(e) => handleChange('salePrice', parseFloat(e.target.value))}
            /><br/>
            <input
                type="number"
                placeholder="Цена покупки"
                onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value))}
            /><br/>
            <div>
                <h4>Выберите сотрудника:</h4>
                {employees.map((employee) => (
                    <button
                        key={employee._id}
                        type="button"
                        onClick={() => handleChange('employeeId', employee._id!)}
                        style={{
                            margin: '5px',
                            padding: '10px',
                            backgroundColor: car.employeeId === employee._id ? 'lightblue' : '',
                        }}
                    >
                        {employee.firstName} {employee.lastName}
                    </button>
                ))}
            </div>
            <button type="submit">Добавить машину</button>
        </form>
    );
};
