import { useState } from "react";
import { addCategory } from "./api";
import { Link, useNavigate } from "react-router-dom";

export default function CreateType() {
    const navigate = useNavigate();

    const [category, setCategory] = useState({
        name: ''
    });

    const handleName = (ev) => {
        setCategory({ ...category, name: ev.target.value });
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        try {
            const savedCategory = await addCategory(category);
            navigate("/categories", {
                state: { message: savedCategory.name + " saved", title: "Saved Category" }
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        onChange={handleName}
                    />
                </div>
                <Link to="/goods" className="btn btn-secondary me-2">Back</Link>
                <button type="submit" className="btn btn-primary">Add Category</button>
            </form>
        </div>
    );
}
