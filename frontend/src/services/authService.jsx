import api from "./api";

export const auth = async ( data ) => {
    try {
        const response = await api.post("auth/login", data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}