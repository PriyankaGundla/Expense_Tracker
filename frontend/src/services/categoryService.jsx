import api from "./api";

export const createCategory = async (data) => {
    try {
        const response = await api.post("categories/create-category", data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await api.get("categories");
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getCategoryById = async (categoryId) => {
    try {
        const response = await api.get(`categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const updateCategory = async (categoryId, data) => {
    try {
        const response = await api.put(`categories/${categoryId}`, data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const deleteCategory = async (categoryId) => {
    try {
        const response = await api.delete(`categories/${categoryId}`);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}