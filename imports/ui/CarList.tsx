import React, { useEffect, useState } from 'react';
import { CarsCollection, Car } from '../api/cars';
import { EmployeesCollection, Employee } from '../api/employees';
import { useTracker } from 'meteor/react-meteor-data';

export const CarList: React.FC = () => {
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const { cars, employees } = useTracker(() => {
        const carsHandle = Meteor.subscribe('cars');
        const employeesHandle = Meteor.subscribe('employees');

        const carsData = carsHandle.ready() ? CarsCollection.find().fetch() : [];
        const employeesData = employeesHandle.ready() ? EmployeesCollection.find().fetch() : [];

        return { cars: carsData, employees: employeesData };
    }, []);

    const getEmployeeName = (employeeId: string) => {
        const employee = employees.find((emp) => emp._id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
    };

    const handleEdit = (car: Car) => {
        setEditingCar(car);
    };

    const handleSave = () => {
        if (editingCar && editingCar._id) {
            // Вызываем метод для обновления данных автомобиля через Meteor.call
            Meteor.call('cars.update', editingCar._id, editingCar, (error: Error) => {
                if (error) {
                    console.error('Error updating car:', error);
                } else {
                    console.log('Car updated successfully');
                }
            });

            setEditingCar(null); // Закрываем форму редактирования
        }
    };

    const handleChange = (field: keyof Car, value: any) => {
        setEditingCar((prev) =>
            prev ? { ...prev, [field]: value } : null
        );
    };

    return (
        <div>
            <div className="list-container">
                {cars.map((car) => (
                    <div className="list-item" key={car._id}>
                        <h3>{car.brand} {car.model}</h3>
                        <p>Color: {car.color || 'N/A'}</p>
                        <p>Engine Number: {car.engineNumber || 'N/A'}</p>
                        <p>Registration Number: {car.registrationNumber || 'N/A'}</p>
                        <p>Body Number: {car.bodyNumber || 'N/A'}</p>
                        <p>Chassis Number: {car.chassisNumber || 'N/A'}</p>
                        <p>Manufacture Date: {car.manufactureDate ? new Date(car.manufactureDate).toLocaleDateString() : 'N/A'}</p>
                        <p>Mileage: {car.mileage !== undefined ? car.mileage : 'N/A'}</p>
                        <p>Release Price: {car.releasePrice !== undefined ? `$${car.releasePrice.toFixed(2)}` : 'N/A'}</p>
                        <p>Sale Price: {car.salePrice !== undefined ? `$${car.salePrice.toFixed(2)}` : 'N/A'}</p>
                        <p>Purchase Price: {car.purchasePrice !== undefined ? `$${car.purchasePrice.toFixed(2)}` : 'N/A'}</p>
                        <p>Assigned to: {getEmployeeName(car.employeeId || '')}</p>
                        <button onClick={() => handleEdit(car)}>Изменить</button>
                    </div>
                ))}
            </div>

            {editingCar && (
                <div className="form-container">
                    <h3>Редактирование автомобиля</h3>
                    <input
                        type="text"
                        placeholder="Марка"
                        value={editingCar.brand}
                        onChange={(e) => handleChange('brand', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Модель"
                        value={editingCar.model}
                        onChange={(e) => handleChange('model', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Цвет"
                        value={editingCar.color || ''}
                        onChange={(e) => handleChange('color', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Номер двигателя"
                        value={editingCar.engineNumber || ''}
                        onChange={(e) => handleChange('engineNumber', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Номер регистрации"
                        value={editingCar.registrationNumber || ''}
                        onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Номер кузова"
                        value={editingCar.bodyNumber || ''}
                        onChange={(e) => handleChange('bodyNumber', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Номер шасси"
                        value={editingCar.chassisNumber || ''}
                        onChange={(e) => handleChange('chassisNumber', e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Дата производства"
                        value={editingCar.manufactureDate ? new Date(editingCar.manufactureDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleChange('manufactureDate', new Date(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Пробег"
                        value={editingCar.mileage || ''}
                        onChange={(e) => handleChange('mileage', parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Цена продажи"
                        value={editingCar.salePrice || ''}
                        onChange={(e) => handleChange('salePrice', parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Цена покупки"
                        value={editingCar.purchasePrice || ''}
                        onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value))}
                    />
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
                                    backgroundColor: editingCar.employeeId === employee._id ? 'lightblue' : '',
                                }}
                            >
                                {employee.firstName} {employee.lastName}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={() => setEditingCar(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
};
