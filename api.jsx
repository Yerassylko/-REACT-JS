import axios from 'axios';

const BASE_URL = 'http://localhost:3005';

export const getGoodsAndCts = async (url) => {
    const [categoriesResponse, goodsResponse] = await axios.all([
        axios.get(`${BASE_URL}/categories`),
        axios.get(url)
    ]);
    return [categoriesResponse.data, goodsResponse.data];
};

export const getAllGoods = async () => {
    const response = await axios.get(`${BASE_URL}/goods`);
    return response.data;
};

export const getCategories = async () => {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
};

export const getOneGood = async (goodId) => {
    const response = await axios.get(`${BASE_URL}/goods/${goodId}`);
    return response.data;
};

export const saveGood = async (good) => {
    const response = await axios.post(`${BASE_URL}/goods`, good, { headers: authHeader() });
    return response.data;
};

export const updateGood = async (good) => {
    try {
        const response = await axios.put(`${BASE_URL}/goods/${good.id}/edit`, good, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
        throw error;
    }
};

export const deleteGood = async (goodId) => {
    const response = await axios.delete(`${BASE_URL}/goods/${goodId}`, { headers: authHeader() });
    return response.data;
};

export const addCategory = async (ct) => {
    if (!isAdmin()) {
        throw new Error("Only administrators can add categories.");
    }
    const response = await axios.post(`${BASE_URL}/categories`, ct, { headers: authHeader() });
    return response.data;
};

export const removeType = async (ct_id) => {
    if (!isAdmin()) {
        throw new Error("Only administrators can remove categories.");
    }
    const response = await axios.delete(`${BASE_URL}/categories/${ct_id}`, { headers: authHeader() });
    return response.data;
};

const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.role === "admin";
};

const authHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

export const doLogin = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password });
        localStorage.setItem("user", JSON.stringify(response.data));
        return { success: true, data: "User was logged in" };
    } catch (error) {
        return { success: false, data: error.response.data.error };
    }
};

export const doRegister = async (email, password, username) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { email, password, username });
        if (response.status === 201) {
            return { success: true, message: "Registration successful" };
        } else {
            return { success: false, message: "Registration failed" };
        }
    } catch (error) {
        return { success: false, message: error.response ? error.response.data.error : error.message };
    }
};

export const addLike = async (goodId) => {
    const response = await axios.post(`${BASE_URL}/goods/${goodId}/like`, null, { headers: authHeader() });
    return response.data;
};

export const removeLike = async (goodId) => {
    const response = await axios.delete(`${BASE_URL}/goods/${goodId}/like`, { headers: authHeader() });
    return response.data;
};

export const checkLikeStatus = async (goodId) => {
    try {
        const response = await axios.get(`http://localhost:3005/goods/${goodId}/like`);
        if (response.status === 200 && response.data) {
            const likeStatus = response.data.like;
            return likeStatus;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка при получении статуса лайка:', error);
        throw error;
    }
};
export function getGoodsByCategory(goods, categoryId) {
    const goodsInCategory = goods.filter(good => good.categoryId === categoryId);
    return Promise.resolve(goodsInCategory);
}
