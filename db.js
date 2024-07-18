const users = [
    { id: 1, email: "khasan@gmail.com", password: "khasan123", username: "Khasan", role: "admin" },
    { id: 2, email: "baga@gmail.com", password: "baga123", username: "Baga", role: "user" },
    { id: 3, email: "aset@gmail.com", password: "aset123", username: "Aset", role: "user" }
];


const categories = [
    { id: "1", name: "Sport" },
    { id: "2", name: "Music" },
    { id: "3", name: "Nature" },
    { id: "4", name: "Game" },
    { id: "5", name: "Office" }
];

const goods = [
    { id: 1, name: "asus", city: "Aktobe", price: 900000, categoryId: "off" }
];

const likes = [
];


module.exports = { users, categories, goods, likes };
