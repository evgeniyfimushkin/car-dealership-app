import React, { useState, useEffect } from 'react';
import { EmployeeList } from '/imports/ui/EmployeeList';
import { EmployeeForm } from '/imports/ui/EmployeeForm';
import { CarList } from '/imports/ui/CarList';
import { CarForm } from '/imports/ui/CarForm';
import { useNavigate } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import {CustomerBuyerList} from "/imports/ui/CustomerBuyerList";
import {CustomerBuyerForm} from "/imports/ui/CustomerBuyerForm";
import {CustomerSellerForm} from "/imports/ui/CustomerSellerForm";
import {CustomerSellerList}from "/imports/ui/CustomerSellerList";
import {SparePartList} from "/imports/ui/SparePartList";
import {SparePartForm} from "/imports/ui/SparePartForm";
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
            case 'customerSellerList':
                return <CustomerSellerList />;
            case 'customerSellerForm':
                return <CustomerSellerForm />;
            case 'customerBuyerList':
                return <CustomerBuyerList />;
            case 'customerBuyerForm':
                return <CustomerBuyerForm />;
            case 'sparePartList':
                return <SparePartList />;
            case 'sparePartForm':
                return <SparePartForm />;
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
                <button onClick={() => setActiveComponent('customerSellerList')}>Список продавцов</button>
                <button onClick={() => setActiveComponent('customerSellerForm')}>Добавить продавцов</button>
                <button onClick={() => setActiveComponent('customerBuyerList')}>Список покупателей</button>
                <button onClick={() => setActiveComponent('customerBuyerForm')}>Добавить покупателей</button>
                <button onClick={() => setActiveComponent('sparePartList')}>Список запчастей</button>
                <button onClick={() => setActiveComponent('sparePartForm')}>Добавить запчасть</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <main>
                {renderComponent()}
            </main>
        </div>
    );
};
