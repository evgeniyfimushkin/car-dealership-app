import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import {useNavigate} from "react-router-dom";

export const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Хук для навигации

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Пароли не совпадают. Попробуйте еще раз.");
            return;
        }

        // Вызов метода регистрации
        Meteor.call('users.register', username, password, (error, result) => {
            if (error) {
                alert(`Ошибка регистрации: ${error.message}`);
            } else {
                console.log('Пользователь успешно зарегистрирован');
                // Можно перенаправить пользователя на страницу входа или главную
            }
        });
    };
    const redirectToRegister = () => {
        navigate('/login'); // Редирект на страницу регистрации
    };
    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button onClick={redirectToRegister} type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};
