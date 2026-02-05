import axios from "axios";
import { SendNotification } from "../utils/notifs.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

// Fonction de test pour les notifications
export function testNotifications() {
    SendNotification("Test notification - Success!", true, true);
    setTimeout(() => {
        SendNotification("Test notification - Error!", true, false);
    }, 3000);
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
        const token = localStorage.getItem("token");
        const user = getUserFromLocalStorage();

        if (!token || !user?.id) {
            return 0;
        }

        // Utiliser getUserBoardProjects qui fonctionne déjà
        const boards = await getUserBoardProjects();
        const count = boards.length;

        return count;
    } catch (error) {
        return 0;
    }
}

export async function getUserBoardProjects() {
    try {
        const token = localStorage.getItem("token");
        const user = getUserFromLocalStorage();

        if (!token) {
            SendNotification("No token found, please login", true, false);
            return [];
        }

        if (!user || !user.id) {
            SendNotification("User information not found, please reconnect", true, false);
            return [];
        }

        // on filtre les boards par user id recuperer de localstorage puis on fait populate pour recuperer les infos user
        const res = await axios.get(`${API_URL}/api/boards?filters[user][id][$eq]=${user.id}&populate=user`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return res.data?.data || []; // ?. pour eviter les valeurs inexistantes
    } catch (error) {
        // si le compte est 401 (token supprimer, utilisateur banni etc...), on deconnecte l'utilisateur
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
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await axios.delete(`${API_URL}/api/boards/${boardId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            handleAuthError();
            throw new Error("Authentication failed");
        }

        const errorMessage = error.response?.data?.error?.message || error.message || "Error deleting board";
        throw new Error(errorMessage);
    }
}

export async function CreateNewRawBoard({ title, description, label, endDate }) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("User not authenticated. Please login first.");
        }

        const user = getUserFromLocalStorage();
        if (!user || !user.id) {
            throw new Error("User information not found. Please login again.");
        }

        //check le nombre de board de l'utilisateur (pas de DDOS)
        const boardCount = await getUserBoardCount();

        if (boardCount >= 20) {
            SendNotification("Limit reached: you cannot create more than 20 boards.", true, false);
            throw new Error("Board creation limit reached");
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
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });


        SendNotification("Board created successfully!", true, true);

        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message || "Error creating board";
        SendNotification(`Error: ${errorMessage}`, true, false);
        throw new Error(errorMessage);
    }
}

export async function updateBoard(boardId, data) {
    try {
        const token = localStorage.getItem("token");
        const endDateToSend = data.endDate === "" ? null : data.endDate;

        const res = await axios.put(`${API_URL}/api/boards/${boardId}`, {
            data: { title: data.title, description: data.description, label: data.label, endDate: endDateToSend }
        }, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } });

        SendNotification("Board updated successfully", true, true);
        return res.data;
    } catch (error) {
        SendNotification("Error updating board: " + (error.message), true, false);
        throw error;
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
