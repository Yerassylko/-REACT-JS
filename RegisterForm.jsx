import React, { useState } from 'react';
import { doRegister } from './api'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegisterForm.css';  

export default function RegisterForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, message } = await doRegister(email, password, username);
        if (success) {
            toast.success("Registration successful");
            navigate("/login"); 
        } else {
            toast.error(message);
        }
    };

    return (
        <div className="register-container">
            <h2>Register Form</h2>
            <ToastContainer />
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label>Email:</label><br />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" /><br />
                </div>
                <div className="form-group">
                    <label>Password:</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" /><br />
                </div>
                <div className="form-group">
                    <label>Username:</label><br />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" /><br />
                </div>
                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
}


