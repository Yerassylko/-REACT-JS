const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const secretKey = "narxoz";
const app = express();

const { users, categories, goods, likes } = require('./db.js');
import { goods } from './db.js';

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/categories', (req, res) => { res.json(categories); });
app.get('/goods', (req, res) => { res.json(goods); });
app.get('/users', (req, res) => { res.json(users); });

const checkUser = (req, res, next) => {
    if (!req.userRole || req.userRole !== 'user') {
        return res.status(403).json({ error: "Access denied", message: "You are not authorized to access this resource." });
    }
    next();
};

const checkAdmin = (req, res, next) => {
    if (!req.userRole || req.userRole !== 'admin') {
        return res.status(403).json({ error: "Access denied", message: "You need admin privileges to access this resource." });
    }
    next();
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email == email && user.password == password);
    if (user) {
        const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            token: token
        });
    } else {
        res.status(401).json({ message: "Wrong password or email", error: "Authentication failed." });
    }
});

const checkToken = (req, res, next) => {
    const authValue = req.headers['authorization'];
    if (!authValue) return res.status(401).json({ error: "Token not found", message: "Authentication token is missing." });
    const token = authValue.split(" ")[1];
    jwt.verify(token, secretKey, (err, value) => {
        if (err) return res.status(401).json({ error: "Invalid token", message: "Authentication token is invalid or expired." });
        req.userId = value.userId;
        req.userRole = value.role;
        next();
    });
};

app.post('/register', (req, res) => {
    const { email, password, username } = req.body;
    const role = "user"; 
    const newUser = { id: users.length + 1, email, password, username, role };
    users.push(newUser);
    res.json({ message: `User ${username} was registered` });
});

app.get('/profile', checkToken, (req, res) => {
    const user = users.find(user => user.id === req.userId);
    if (user) {
        res.json({ id: user.id, username: user.username, role: user.role });
    } else {
        res.status(404).json({ message: "User not found", error: "The requested user profile could not be found." });
    }
});

app.post('/categories', checkToken, checkAdmin, (req, res) => {
    const { name } = req.body;
    const newCategory = { id: categories.length + 1, name, enabled: true };
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

app.put('/categories/:id/toggle', checkToken, checkAdmin, (req, res) => {
    const { id } = req.params;
    const category = categories.find(ct => ct.id == id);
    if (category) {
        category.enabled = !category.enabled;
        res.json(category);
    } else {
        res.status(404).json({ message: "Category not found", error: "The requested category could not be found." });
    }
});

app.delete('/categories/:id', checkToken, checkAdmin, (req, res) => {
    const { id } = req.params;
    const index = categories.findIndex(ct => ct.id == id);
    if (index !== -1) {
        categories.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Category not found", error: "The requested category could not be found." });
    }
});

app.post('/goods', checkToken, (req, res) => {
    const { name, city, price, categoryId } = req.body;
    const newGood = { id: goods.length + 1, name, city, price, categoryId, userId: req.userId };
    goods.push(newGood);
    res.status(201).json(newGood);
});

app.put('/goods/:id/edit', checkToken, checkAdmin, (req, res) => {
    const { id } = req.params;
    const { name, city, price, categoryId } = req.body;
    const goodIndex = goods.findIndex(g => g.id == id);
    if (goodIndex !== -1) {
        goods[goodIndex] = { ...goods[goodIndex], name, city, price, categoryId };
        res.json(goods[goodIndex]);
    } else {
        res.status(404).json({ message: "Good not found", error: "The requested good could not be found." });
    }
});
app.get('/categories/:categoryId/goods', (req, res) => {
    const categoryId = req.params.categoryId;
    
    
    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is missing", message: "Please provide a category ID." });
    }

  һ
    const category = categories.find(ct => ct.id === Number(categoryId));

 
    if (!category) {
        return res.status(404).json({ error: "Category not found", message: "The requested category could not be found." });
    }

    
    const filteredGoods = goods.filter(good => good.categoryId === categoryId);

    
    if (filteredGoods.length === 0) {
        return res.status(404).json({ error: "No goods found", message: "There are no goods in this category." });
    }

    res.json(filteredGoods);
});
app.listen(3005, () => {
    console.log('Server is running on port 3000');
});
