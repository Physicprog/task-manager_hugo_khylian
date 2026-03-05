
import axios from "axios";
import  { API_URL }  from "./authService.js";
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

        const response = await axios.get(
            `${API_URL}/api/boards/${boardId}?populate[columns][populate]=*&populate[cards][populate]=*`,
            {headers: {"Authorization": `Bearer ${token}`}}
        );

        const board = response.data?.data;

        if (!board) {
            return "Board not found";
        }

        if (paramToReturn === "boardName") {
            return board.title || "Untitled Board";
        }

        if (paramToReturn === "columns") {
            return board.columns?.data || board.columns || [];
        }

        if (paramToReturn === "cards") {
            return board.cards?.data || board.cards || [];
        }

        return board;
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


export default async function createBoard(title) {
    try {
        const token = checkAuthentication();
        if (!token) return;
        const response = await axios.post(`${API_URL}/api/boards`, { title }, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        return response.data.data;
    }
    catch (error) {
        SendNotification('Error while creating board', true, false)
    }
}
