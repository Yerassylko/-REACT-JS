import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navigation.css';
import CategoriesPage from './CategoriesPage'; 

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();

    const [hasToken, setHasToken] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (location.state) {
            toast(location.state.message);
            location.state = null;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setHasToken(true);
            setIsAdmin(user.role === "admin");
        } else {
            setHasToken(false);
            setIsAdmin(false);
        }
    }, [location]);

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <div>
            <ToastContainer />
            <nav className="navigation">
                {hasToken ? (
                    <>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <Link to="/goods" className="nav-link">Goods</Link>
                        <Link to="/categories" className="nav-link">Categories</Link>
                        <button onClick={logout} className="nav-button">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")} className="nav-button">Login</button>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </nav>
            =
            <Outlet />
        </div>
    );
}
