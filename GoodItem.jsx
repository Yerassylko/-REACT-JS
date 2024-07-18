import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export default function GoodItem() {
    const response = useLoaderData();

    return (
        <div>
            <p>Name: {response.name}</p>
            <p>Price: {response.price}</p>
            <p>City: {response.city}</p>
            <Link to="/goods">Tauarlar</Link>
        </div>
    );
}
