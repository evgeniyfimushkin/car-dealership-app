import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Хук для навигации

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
                alert(error.message); // Показываем ошибку, если она возникла
            } else {
                console.log('Successfully logged in');
                navigate('/'); // Редирект на главную страницу после успешного входа
            }
        });
    };

    const redirectToRegister = () => {
        navigate('/register'); // Редирект на страницу регистрации
    };
    const redirectToServer = () => {
        navigate('/'); // Редирект на страницу регистрации
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <button onClick={redirectToServer} >Войти</button>
            </form>
            <button onClick={redirectToRegister} style={{marginTop: '10px' }}>
                Register here
            </button>
        </div>
    );
};
