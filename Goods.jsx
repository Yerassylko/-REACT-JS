import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { deleteGood, getGoodsAndCts, addLike, removeLike } from './api';

export default function Goods() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const [categories, setCategories] = useState([]);
    const [goods, setGoods] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = params.ctId ? `http://localhost:3005/goods?categoryId=${params.ctId}` : 'http://localhost:3005/goods';
                console.log('API URL:', url);
                const [categories, goods] = await getGoodsAndCts(url);
                console.log('Fetched categories:', categories);
                console.log('Fetched goods:', goods);
                setCategories(categories);
                setGoods(goods);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [params.ctId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(user && user.role === "admin");

        if (location.state) {
            NotificationManager.success(location.state.message, location.state.title, 3000);
        }
    }, [location]);

    const handleClick = async (goodId) => {
        try {
            await deleteGood(goodId);
            navigate("/goods", { state: { message: "Good deleted successfully", title: "DELETE..." } });
        } catch (error) {
            NotificationManager.error("Error deleting good", "Error");
        }
    };

    const handleLike = async (goodId) => {
        try {
            await addLike(goodId);
            setGoods(goods.map(good => 
                good.id === goodId ? { ...good, likes: good.likes + 1 } : good
            ));
        } catch (error) {
            console.error('Error adding like:', error);
        }
    };

    const handleDislike = async (goodId) => {
        try {
            await removeLike(goodId);
            setGoods(goods.map(good => 
                good.id === goodId ? { ...good, likes: good.likes - 1 } : good
            ));
        } catch (error) {
            console.error('Error removing like:', error);
        }
    };

    return (
        <div className="container">
            <NotificationContainer />
            {isAdmin && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Goods</h2>
                    <Link to="/goods/create" className="btn btn-primary">Create</Link>
                </div>
            )}
            <div className="mt-3">
                {isAdmin && (
                    <>
                        <Link to="/categories/create" className="btn btn-primary">Create New Category</Link> <br /><br />
                        <Link to="/categories/" className="btn btn-primary">Show categories</Link>
                    </>
                )}
            </div>
            <div className="list-group">
                {categories.map((ct) => (
                    <Link key={ct.id} to={`/goods/category/${ct.id}`} className="list-group-item">{ct.name}</Link>
                ))}
            </div>
            <hr />
            {goods.map((good) => (
                <div key={good.id} className="card mb-3">
                    <div className="card-body">
                        <Link to={`/goods/${good.id}`} className="card-title">{good.name}</Link>
                        <p>{good.likes} Likes</p>
                        {!isAdmin && (
                            <div>
                                <button onClick={() => handleLike(good.id)} className="btn btn-sm btn-outline-primary mx-2">Like</button>
                                <button onClick={() => handleDislike(good.id)} className="btn btn-sm btn-outline-danger" style={{ color: '#dc3545', borderColor: '#dc3545' }}>Dislike</button>
                            </div>
                        )}
                        {isAdmin && (
                            <>
                                <Link to={`/goods/${good.id}/edit`} className="btn btn-sm btn-outline-primary mx-2">Edit</Link>
                                <button onClick={() => handleClick(good.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
            <Outlet />
        </div>
    );
}
