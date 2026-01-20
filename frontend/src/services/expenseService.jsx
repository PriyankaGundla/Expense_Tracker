import api from "./api";

export const createExpense = async (data) => {
    try {
        const response = await api.post("expenses/create-expense", data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getExpenses = async () => {
    try {
        const response = await api.get("expenses");
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
} 

export const getTotalExpenseByCurrentMonth = async () => {
    try {
        const response = await api.get(`expenses/total-expense/current-month`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getExpenseById = async (expenseId) => {
    try {
        const response = await api.get(`expenses/${expenseId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const updateExpense = async (expenseId, data) => {
    try {
        const response = await api.put(`expenses/${expenseId}`, data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const deleteExpense = async (expenseId) => {
    try {
        const response = await api.delete(`expenses/${expenseId}`);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

