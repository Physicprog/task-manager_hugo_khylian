import axios from "axios";
import  { API_URL } from "./authService.js";

export async function createCard(columnId, boardId, cardData) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // Récupérer les cartes existantes de la colonne pour calculer la position
        const existingCards = await getCardsByColumn(columnId);
        let nextPosition = 0;
        
        if (existingCards && existingCards.length > 0) {
            // Trouver la position maximale et ajouter 1
            const maxPosition = Math.max(...existingCards.map(card => card.position || 0));
            nextPosition = maxPosition + 1;
        }

        const payload = {
            data: {
                title: cardData.title,
                description: cardData.description || "",
                priority: cardData.priority || "normal",
                dueDate: cardData.dueDate || null,
                labels: cardData.labels || null,
                position: nextPosition,
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

function getCardIdentifier(cardId) {
    // Si l'ID est un documentId (long string), on l'utilise
    // Si c'est un ID numérique classique, on essaie les deux
    return cardId;
}

export async function updateCard(cardId, cardData) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        const cardIdentifier = getCardIdentifier(cardId);
        
        const updateData = {};
        
        if (cardData.title !== undefined) updateData.title = cardData.title;
        if (cardData.description !== undefined) updateData.description = cardData.description;
        if (cardData.priority !== undefined) updateData.priority = cardData.priority;
        if (cardData.dueDate !== undefined) updateData.dueDate = cardData.dueDate;
        if (cardData.labels !== undefined) updateData.labels = cardData.labels;
        if (cardData.favorite !== undefined) updateData.favorite = cardData.favorite;
        if (cardData.position !== undefined) updateData.position = cardData.position;
        
        if (cardData.columnId !== undefined) {
            updateData.column = cardData.columnId;
        } else if (cardData.column !== undefined) {
            updateData.column = cardData.column;
        }

        const response = await axios.put(
            `${API_URL}/api/cards/${cardIdentifier}`,
            { data: updateData },
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
        console.error("Card data sent:", cardData);
        throw error;
    }
}

export async function moveCard(cardId, targetColumnId, position = 0) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        
        const cardIdentifier = getCardIdentifier(cardId);
        const response = await axios.put(
            `${API_URL}/api/cards/${cardIdentifier}`,
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
        const cardIdentifier = getCardIdentifier(cardId);
        const response = await axios.delete(
            `${API_URL}/api/cards/${cardIdentifier}`,
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

