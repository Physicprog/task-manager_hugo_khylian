import axios from "axios";
import { SendNotification } from "../utils/notifs";
import  { API_URL } from "./authService.js";


export async function createColumn(boardId, title) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            SendNotification("User not authenticated", true, false);
            return;
        }

        const response = await axios.post(`${API_URL}/api/columns`,
            { data: { name: title, board: boardId, position: 0} },
            {headers: {"Authorization": `Bearer ${token}`}}
        );

        return response.data.data || null;
    } catch (error) {
        SendNotification("Error creating column: " + error.message, true, false);
    }
}

export async function updateColumn(columnId, data) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            SendNotification("User not authenticated", true, false);
            return;
        }

        const response = await axios.put(`${API_URL}/api/columns/${columnId}`,
            {data: {name: data.title}},{headers: {"Authorization": `Bearer ${token}`}}
        );

        return response.data.data || null;
    } catch (error) {
        SendNotification("Error updating column: " + error.message, true, false);
    }
}

export async function updateColumnsPositions(columns) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            SendNotification("User not authenticated", true, false);
            return;
        }

        const promises = [];
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const updatePromise = axios.put(`${API_URL}/api/columns/${column.id}`,
                {data: {position: i}},{headers: {"Authorization": `Bearer ${token}`}}
            );
            promises.push(updatePromise);
        }

        await Promise.all(promises);
        return true;
    } catch (error) {
        SendNotification("Error updating columns positions: " + error.message, true, false);
        return false;
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
        //on recupere directement les colonnes du board (filtre par board) et on les trie pour les afficher dans l'ordre
        const response = await axios.get(
            `${API_URL}/api/columns?populate[0]=board&sort=position:asc`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const allColumns = response.data.data;
        const filteredColumns = [];

        //on garde que les colonne du board ouvert actuellement
        for (let i = 0; i < allColumns.length; i++) {
            const col = allColumns[i];
            const colBoardId = col.board ? col.board.documentId : undefined; //on check si la colonne a un board associé avec le bon id
            if (colBoardId === boardId) {
                filteredColumns.push(col); //si c'est le cas on garde la colonne dans filteredColumns
            }
        }

        const columnsWithCards = [];

        for (let i = 0; i < filteredColumns.length; i++) {
            const col = filteredColumns[i];
            let cards = [];
            try { /*on recupere toutes les cartes de la colonne, et pour toutes les colonnes */
                const cardsResponse = await axios.get(
                    `${API_URL}/api/cards?filters[column][id][$eq]=${col.id}&sort=position:asc`,
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                cards = cardsResponse.data.data || [];
            } catch (error) {
                cards = [];
            }

            columnsWithCards.push({ //on construit un objet pour chaque colonne avec ses cartes associées dessus
                id: col.id,
                documentId: col.documentId,
                name: col.name,
                position: col.position,
                board: col.board,
                createdAt: col.createdAt,
                updatedAt: col.updatedAt,
                cards: cards});
        }

        return columnsWithCards;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                SendNotification("Board not found", false, false);
                return null;
            } else {
                SendNotification("Server error", true, false);
                return null;
            }
        }
        SendNotification("Server error while fetching columns", true, false);
        return null;
    }
}