import React, { useState } from 'react';
import { EmployeesCollection, Employee } from '../api/employees';

export const EmployeeForm: React.FC = () => {
    const [employee, setEmployee] = useState<Partial<Employee>>({});

    const handleChange = (field: keyof Employee, value: string | number | Date) => {
        setEmployee({ ...employee, [field]: value });
    };

    const handleSubmit = () => {
        Meteor.call('employees.insert', employee, (err: Error) => {
            if (err) {
                alert(`Ошибка: ${err.message}`);
            } else {
                alert('Сотрудник добавлен');
            }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input type="text" placeholder="Имя" onChange={(e) => handleChange('firstName', e.target.value)} /><br/>
            <input type="text" placeholder="Фамилия" onChange={(e) => handleChange('lastName', e.target.value)} /><br/>
            <input type="text" placeholder="Адрес" onChange={(e) => handleChange('address', e.target.value)} /><br/>
            <input type="date" placeholder="Дата рождения" onChange={(e) => handleChange('birthDate', e.target.valueAsDate || new Date())} /><br/>
            <input type="text" placeholder="Должность" onChange={(e) => handleChange('position', e.target.value)} /><br/>
            <input type="number" placeholder="Оклад" onChange={(e) => handleChange('salary', parseFloat(e.target.value))} /><br/>
            <button type="submit">Добавить сотрудника</button>
        </form>
    );
};
