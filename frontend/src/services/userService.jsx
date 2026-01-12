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