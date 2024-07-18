import { useState, useEffect } from 'react';
import { saveGood, getCategories } from './api';
import { NotificationContainer } from 'react-notifications';
import { useNavigate } from 'react-router-dom';

export default function CreateForm() {
  const navigate = useNavigate();

  const [good, setGood] = useState({
    name: '',
    city: '',
    price: 0,
    categoryId: '' 
  });

  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

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

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const savedGood = await saveGood(good);
      navigate("/goods", { state: { message: savedGood.name + " saved", title: "Saved" } });
    } catch (error) {
      console.error(error);
      // Handle error or display error message
    }
  };

  return (
    <div className="container">
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
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
