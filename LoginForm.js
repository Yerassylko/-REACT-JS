import React, { useState } from 'react';
import { doLogin } from './api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginForm.css'; 
import { NotificationContainer, NotificationManager } from 'react-notifications'; 

export default function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, data } = await doLogin(email, password);
        if (success) {
            navigate("/goods", { state: { message: "You have successfully logged in!" } });
        } else {
            toast.error(data);
        }
    };

    return (
        <div className="login-container">
            <h2>Login Form</h2>
            <ToastContainer />
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Email:</label><br />
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    /><br />
                </div>
                <div className="form-group">
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    /><br />
                </div>
                <button type="submit" className="btn">Login</button>
            </form>
        </div>
    );
}
