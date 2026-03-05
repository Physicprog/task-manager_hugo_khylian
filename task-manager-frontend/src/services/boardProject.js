import axios from "axios";
import { SendNotification } from "../utils/notifs.js";
import { API_URL, getUserInfoFromStorage } from "./authService.js";

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

//deconnecte l'utilisateur et refresh la page
function handleAuthError() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    SendNotification("Session ended, please reconnect", true, false);
    window.location.reload();
}

export async function getUserBoardCount() {
    try {
        const token = getToken();
        const user = getUserInfoFromStorage();

        if (!token || !user || !user.id) {
            return 0;
        }

        const boards = await getUserBoardProjects();
        const count = boards.length;

        return count;
    } catch (error) {
        return 0;
    }
}

export async function getUserBoardProjects() {
    try {
        const token = checkAuthentication();
        const user = getUserInfoFromStorage();

        if (!token) {
            return [];
        }

        if (!user || !user.id) {
            SendNotification("User information not found, please reconnect", true, false);
            return [];
        }

        // on filtre les boards par user id recuperer de localstorage puis on fait populate pour recuperer les infos user
        const res = await axios.get(`${API_URL}/api/boards?filters[user][id][$eq]=${user.id}&populate=user`, {
            headers: {"Authorization": `Bearer ${token}`}
        });

        return res.data && res.data.data ? res.data.data : [];
    } catch (error) {
        if (error.response?.status === 401) {
            handleAuthError();
            return [];
        }

        SendNotification("Error loading projects", true, false);
        return [];
    }
}

export async function deleteBoard(boardId) {
    try {
        const token = checkAuthentication();
        if (!token) return;

        const response = await axios.delete(`${API_URL}/api/boards/${boardId}`, {
            headers: {"Authorization": `Bearer ${token}`}
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            handleAuthError();
            SendNotification("Board not found or already deleted", true, false);
            return;
        }

        const errorMessage = error.response && error.response.data && error.response.data.error && error.response.data.error.message ? error.response.data.error.message : error.message || "Error deleting board";
        SendNotification(`Error: ${errorMessage}`, true, false);
    }
}

export async function CreateNewRawBoard({ title, description, label, endDate }) {
    try {
        const token = checkAuthentication();
        if (!token) return;

        const user = getUserFromLocalStorage();
        if (!user || !user.id) {
            SendNotification("User information not found. Please login again.", true, false);
            return;
        }

        //pour eviter de saturer la base
        const boardCount = await getUserBoardCount();

        if (boardCount >= 20) {
            SendNotification("Limit reached: you cannot create more than 20 boards.", true, false);
            return;
        }

        const boardData = { // boards afficher par defaut
            title: title || "Untitled Board",
            description: description || "",
            label: label || "Blue",
            user: user.id
        };

        if (endDate) {
            boardData.endDate = endDate;
        }

        const response = await axios.post(`${API_URL}/api/boards`, {
            data: boardData
        }, {
            headers: {"Authorization": `Bearer ${token}`}
        });


        SendNotification("Board created successfully!", true, true);

        return response;
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.error && error.response.data.error.message ? error.response.data.error.message : error.message || "Error creating board";
        SendNotification(`Error: ${errorMessage}`, true, false);
    }
}

export async function updateBoard(boardId, data) {
    try {
        const token = getToken();
        const idToUse = boardId;

        const endDateToSend = data.endDate === "" ? null : data.endDate;

        const res = await axios.put(`${API_URL}/api/boards/${idToUse}`, {
            data: { title: data.title, description: data.description, label: data.label, endDate: endDateToSend }
        }, { headers: {"Authorization": `Bearer ${token}` } });

        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            SendNotification("Board not found. It may have been deleted.", true, false);
        } else {
            SendNotification("Error updating board: ", true, false);
        }
    }
}

export function getUserFromLocalStorage() {
    try {
        const userString = localStorage.getItem("userInfo");
        if (!userString) return null;

        const user = JSON.parse(userString);
        return {
            id: user.id,
            username: user.username
        };
    } catch (error) {
        return null;
    }
}