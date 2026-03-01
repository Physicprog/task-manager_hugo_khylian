import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

export async function createCard(columnId, boardId, cardData) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const payload = {
            data: {
                title: cardData.title,
                description: cardData.description || "",
                priority: cardData.priority || "normal",
                dueDate: cardData.dueDate || null,
                labels: cardData.labels || null,
                position: 0,
                column: columnId,
                board: boardId
            }
        };

        const response = await axios.post(
            `${API_URL}/api/cards`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data?.data;
    } catch (error) {
        console.error("Error creating card:", error.response?.data || error);
        throw error;
    }
}

export async function updateCard(cardId, cardData) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        const response = await axios.put(
            `${API_URL}/api/cards/${cardId}`,
            {
                data: {
                    title: cardData.title,
                    description: cardData.description,
                    priority: cardData.priority,
                    dueDate: cardData.dueDate,
                    labels: cardData.labels,
                    favorite: cardData.favorite,
                    column: cardData.columnId,
                    position: cardData.position
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data?.data;
    } catch (error) {
        console.error("Error updating card:", error);
        throw error;
    }
}

export async function moveCard(cardId, targetColumnId, position = 0) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        
        const response = await axios.put(
            `${API_URL}/api/cards/${cardId}`,
            {
                data: {
                    column: targetColumnId,
                    position: position
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data?.data;
    } catch (error) {
        console.error("Error moving card:", error);
        throw error;
    }
}

export async function deleteCard(cardId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        const response = await axios.delete(
            `${API_URL}/api/cards/${cardId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting card:", error);
        throw error;
    }
}

export async function getCardsByColumn(columnId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.get(`${API_URL}/api/cards?filters[column][id][$eq]=${columnId}`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        }
        );

        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
}

