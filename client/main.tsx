import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import {LoginForm} from "/imports/ui/Login";
import {RegisterForm} from "/imports/ui/Register";

Meteor.startup(() => {
    const container = document.getElementById('react-target'); // Находим элемент для рендера
    if (container) {
        const root = createRoot(container); // Создаем корень React
        root.render(

            // <Routes />
            // <App/>
            // <LoginForm/>
            // <RegisterForm/>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/" element={Meteor.userId() ? <App /> : <Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        ); // Рендерим компонент App
    }
});
