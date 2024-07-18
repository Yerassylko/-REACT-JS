import { Link, useLoaderData, useNavigate } from "react-router-dom";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { removeType } from "./api";

export default function Types() {
    const navigate = useNavigate();
    const ct = useLoaderData();

    const handleClick = async (ct) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
        if (confirmDelete) {
            try {
                await removeType(ct.id);
                NotificationManager.success(ct.name + " deleted", "Deleted Category", 3000);
                navigate("/categories/");
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    }

    return (
        <div className="container mt-5">
            <NotificationContainer />
            <div className="row">
                {ct.map((ct) => (
                    <div className="col-md-4 mb-3" key={ct.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{ct.name}</h5>
                                <button onClick={() => handleClick(ct)} className="btn btn-danger me-2">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                <Link to="/goods/" className="btn btn-secondary">Back</Link>
            </div>
        </div>
    );
}
