import axios from "axios";
import  { API_URL, getUserInfoFromStorage } from "./authService.js";
import { SendNotification } from "../utils/notifs.js";

function checkAuthentication() {
    const token = localStorage.getItem("token");
    if (!token) {
        SendNotification("User not authenticated", true, false);
        return null;
    }
    return token;
}

export async function createCard(columnId, boardId, cardData) {
    try {
        const token = checkAuthentication();
        if (!token) return;
        const existingCards = await getCardsByColumn(columnId);
        let nextPosition = 0;
        
        if (existingCards && existingCards.length > 0) {
            var maxPosition = Math.max(...existingCards.map(card => card.position || 0)); //recupere l'index max des cartes de la colonne pour mettre après
            nextPosition = maxPosition + 1; 
        }


        const user = getUserInfoFromStorage();
        const userId = user ? user.id : null;

        const response = await axios.post(`${API_URL}/api/cards`,{
                data: {
                    title: cardData.title,
                    description: cardData.description || "",
                    priority: cardData.priority || "normal",
                    dueDate: cardData.dueDate || null,
                    labels: cardData.labels || null,
                    position: nextPosition, 
                    column: columnId,
                    board: boardId,
                    user: userId
                }
            },{headers: {"Authorization": `Bearer ${token}`}
            }
        );

        return response.data.data;
    } catch (error) {
        SendNotification("Error creating card: " + error.message, true, false);
    }
}

function getCardIdentifier(cardId) {
    return cardId;
}

export async function updateCard(cardId, cardData) {
    try {
        const token = checkAuthentication();
        if (!token) return; 
        const cardIdentifier = getCardIdentifier(cardId);
        

        // permet de mettre a jour seulement les champs dans cardData qui sont définis, et laisse les autres
        const updateData = {};
        if (cardData.title !== undefined) updateData.title = cardData.title;
        if (cardData.description !== undefined) updateData.description = cardData.description;
        if (cardData.priority !== undefined) updateData.priority = cardData.priority;
        if (cardData.dueDate !== undefined) updateData.dueDate = cardData.dueDate;
        if (cardData.labels !== undefined) updateData.labels = cardData.labels;
        if (cardData.favorite !== undefined) updateData.favorite = cardData.favorite;
        if (cardData.position !== undefined) updateData.position = cardData.position;
        

        //met à jour la colonne lier à la carte, en vérifiant si c'est columnId ou column qui est défini dans cardData
        if (cardData.columnId !== undefined) {
            updateData.column = cardData.columnId;
        } else if (cardData.column !== undefined) {
            updateData.column = cardData.column;
        }

        //on met a jour la carte avec les champs définis dans updateData sur Strapi, en utilisant l'identifiant de la carte
        const response = await axios.put(`${API_URL}/api/cards/${cardIdentifier}`,
            { data: updateData },
            { headers: {"Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data.data;
    } catch (error) {
        SendNotification("Error updating card: " + error.message, true, false);
    }
}

export async function moveCard(cardId, targetColumnId, position = 0) {
    try {
        const token = checkAuthentication();
        if (!token) return;
        
        const cardIdentifier = getCardIdentifier(cardId);

        const response = await axios.put(
            `${API_URL}/api/cards/${cardIdentifier}`,
            {data: {column: targetColumnId,position: position}},
            {headers: {"Authorization": `Bearer ${token}`}}
        );

        return response.data.data;
    } catch (error) {
        SendNotification("Error while moving card", true, false);
        return;
    }
}

export async function deleteCard(cardId) {
    try {
        const token = checkAuthentication();
        if (!token) return;
        const cardIdentifier = getCardIdentifier(cardId);

        const response = await axios.delete(
            `${API_URL}/api/cards/${cardIdentifier}`,
            {headers: {"Authorization": `Bearer ${token}`}}
        );

        return response.data;
    } catch (error) {
        SendNotification("Error while deleting card", true, false);
        return;
    }
}

export async function getCardsByColumn(columnId) {
    try {
        const token = checkAuthentication();
        if (!token) return [];

        const response = await axios.get(`${API_URL}/api/cards?filters[column][id][$eq]=${columnId}`, {
            headers: {"Authorization": `Bearer ${token}` }}
        );

        return response.data && response.data.data ? response.data.data : [];
    } catch (error) {
        SendNotification("Error fetching cards:", true, false);
        return [];
    }
}