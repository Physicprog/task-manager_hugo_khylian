import axios from "axios";
import { SendNotification } from "../utils/notifs";
import  { API_URL } from "./authService.js";


export async function createColumn(boardId, title) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.post(`${API_URL}/api/columns`,
            { data: { name: title, board: boardId, position: 0} },
            {headers: {"Authorization": `Bearer ${token}`}}
        );

        return response.data?.data;
    } catch (error) {
        SendNotification("Error creating column: " + error.message, true, false);
    }
}

export async function updateColumn(columnId, data) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.put(`${API_URL}/api/columns/${columnId}`,
            {data: {name: data.title}
            },{headers: {"Authorization": `Bearer ${token}`}}
        );

        return response.data?.data;
    } catch (error) {
        SendNotification("Error updating column: " + error.message, true, false);
    }
}

export async function deleteColumn(columnId) {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/api/columns/${columnId}`,{headers: {"Authorization": `Bearer ${token}`}});
        return response.data;
    } catch (error) {
        SendNotification("Error deleting column: " + error.message, true, false);
    }
}

export async function getColumnsByBoard(boardId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }

        const url = `${API_URL}/api/columns?populate[0]=board&sort=position:asc`; // On trie par ordre de position ascendant pour éviter les problèmes de positionnement 

        const response = await axios.get(url, {headers: {"Authorization": `Bearer ${token}`}});

        const allColumns = response.data.data;

        const filteredColumns = allColumns.filter(col => {
            const colBoardId = col.board?.documentId;
            return colBoardId === boardId;
        });

        const columnsWithCards = await Promise.all(
            filteredColumns.map(async (col) => {
                try {
                    const cardsResponse = await axios.get(
                        `${API_URL}/api/cards?filters[column][id][$eq]=${col.id}&sort=position:asc`,
                        {headers: { "Authorization": `Bearer ${token}`}}
                    );

                    return {
                        id: col.id,
                        documentId: col.documentId,
                        name: col.name,
                        position: col.position,
                        board: col.board,
                        createdAt: col.createdAt,
                        updatedAt: col.updatedAt,
                        cards: cardsResponse.data.data || []
                    };
                } catch (error) {
                    return {
                        id: col.id,
                        documentId: col.documentId,
                        name: col.name,
                        position: col.position,
                        board: col.board,
                        createdAt: col.createdAt,
                        updatedAt: col.updatedAt,
                        cards: []
                    };
                }
            })
        );

        return columnsWithCards;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                return "Board not found";
            }
            if (error.response.status === 401 || error.response.status === 403) {
                return null;
            }
        }
        
        return "Server error";
    }
}