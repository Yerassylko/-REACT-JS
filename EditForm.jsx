import React, { useState, useEffect } from 'react';
import { getOneGood, updateGood, getCategories } from './api';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditForm() {
    const navigate = useNavigate();
    const params = useParams();

    const [categories, setCategories] = useState([]);
    const [good, setGood] = useState({
        name: '',
        city: '',
        price: 0,
        categoryId: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        };

        fetchCategories();

        const fetchGood = async () => {
            try {
                const response = await getOneGood(params.goodId);
                setGood(response);
            } catch (error) {
                console.error('Ошибка при получении товара:', error);
            }
        };

        fetchGood();
    }, [params.goodId]);

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        try {
            const updatedGood = await updateGood(good);
            navigate('/goods', { state: { message: `${good.name} успешно обновлен`, title: 'Обновление' } });
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error);
            toast.error('Ошибка при обновлении товара');
        }
    };

    const handleName = (ev) => {
        setGood({ ...good, name: ev.target.value });
    };

    const handleCity = (ev) => {
        setGood({ ...good, city: ev.target.value });
    };

    const handlePrice = (ev) => {
        setGood({ ...good, price: parseInt(ev.target.value) });
    };

    const handleCategory = (ev) => {
        setGood({ ...good, categoryId: ev.target.value });
    };

    return (
        <div className="container">
            <h2>Editing</h2>
            <NotificationContainer />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" className="form-control" value={good.name} onChange={handleName} />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" className="form-control" value={good.city} onChange={handleCity} />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" className="form-control" value={good.price} onChange={handlePrice} />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select id="category" className="form-control" value={good.categoryId} onChange={handleCategory}>
                        <option value="">Select category...</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </form>
        </div>
    );
}
