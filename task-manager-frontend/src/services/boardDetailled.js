import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

export async function getBoardDetails(boardId, paramToReturn) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return null;
        }

        const response = await axios.get(
            `${API_URL}/api/boards/${boardId}?populate[columns][populate]=*&populate[cards][populate]=*`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
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
        console.error("Error fetching board details:", error);
        return null;
    }
}


export default async function createBoard(title) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");
        const response = await axios.post(`${API_URL}/api/boards`, { title }, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });

        return response.data?.data;
    }
    catch (error) {
        console.error("Error creating board:", error);
        throw error;
    }
}

