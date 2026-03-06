import axios from "axios";
import { API_URL } from "./authService.js";
import { SendNotification } from "../utils/notifs.js";

function getToken() {
    return localStorage.getItem("token");
}

function checkAuthentication() {
    const token = getToken();
    if (!token) {
        SendNotification("User not authenticated", true, false);
        return null;
    }
    return token;
}

export async function getBoardDetails(boardId, paramToReturn) {
    try {
        const token = getToken();
        if (!token) return null;

        const meResponse = await axios.get(`${API_URL}/api/users/me`, { //on recupere l'username 
            headers: { "Authorization": `Bearer ${token}` }});

        const currentUserId = meResponse.data && meResponse.data.id;

        const response = await axios.get(
            `${API_URL}/api/boards/${boardId}?populate=*`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const board = response.data && response.data.data;

        if (!board) {
            return "Board not found";
        }

        let boardOwnerId = null;
      
        if (board.user && board.user.id) //si l'id d'un board colle avec l'id de l'user alors on skip sinon on bascule sur une erreur juste après
            boardOwnerId = board.user.id; 

        

        if (boardOwnerId !== null && boardOwnerId !== currentUserId) {
            SendNotification("Access denied: this board does not belong to you.", true, false);
            return "forbidden";
        }

        if (paramToReturn === "boardName") {
            return board.title || "Untitled Board";
        }

        if (paramToReturn === "columns") {
            return (board.columns && board.columns.data) || board.columns || [];
        }

        if (paramToReturn === "cards") {
            return (board.cards && board.cards.data) || board.cards || [];
        }

        return board;
    } catch (error) {
        SendNotification( "Server error", true, false);
    }
}

export default async function createBoard(title) {
    try {
        const token = checkAuthentication();
        if (!token) return;
        const response = await axios.post(`${API_URL}/api/boards`, { title }, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        return response.data.data;
    } catch (error) {
        SendNotification('Error while creating board', true, false);
    }
}