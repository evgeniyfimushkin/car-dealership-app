import React, { useState, useEffect } from 'react';
import { EmployeeList } from '/imports/ui/EmployeeList';
import { EmployeeForm } from '/imports/ui/EmployeeForm';
import { CarList } from '/imports/ui/CarList';
import { CarForm } from '/imports/ui/CarForm';
import { useNavigate } from "react-router-dom";
import { Meteor } from 'meteor/meteor';

export const App: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('employeeList');
    const navigate = useNavigate();

    // Проверка, авторизован ли пользователь
    useEffect(() => {
        if (!Meteor.userId()) {
            navigate('/login'); // Редирект на страницу входа
        }
    }, [navigate]);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'employeeList':
                return <EmployeeList />;
            case 'employeeForm':
                return <EmployeeForm />;
            case 'carList':
                return <CarList />;
            case 'carForm':
                return <CarForm />;
            default:
                return null;
        }
    };

    const handleLogout = () => {
        Meteor.logout(() => {
            navigate('/login'); // Редирект после выхода
        });
    };

    return (
        <div>
            <nav>
                <button onClick={() => setActiveComponent('employeeList')}>Список сотрудников</button>
                <button onClick={() => setActiveComponent('employeeForm')}>Добавить сотрудника</button>
                <button onClick={() => setActiveComponent('carList')}>Список автомобилей</button>
                <button onClick={() => setActiveComponent('carForm')}>Добавить автомобиль</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <main>
                {renderComponent()}
            </main>
        </div>
    );
};
