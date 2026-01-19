import api from "./api";

export const createUser = async ( data ) => {
    try {
        const response = await api.post("users/create-user", data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getUserById = async ( userId ) => {
    try {
        const response = await api.get(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}