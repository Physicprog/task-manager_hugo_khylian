import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

export async function createColumn(boardId, title) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.post(
            `${API_URL}/api/columns`,
            {
                data: {
                    name: title,
                    board: boardId,
                    position: 0
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
        console.error("Error creating column:", error.response?.data || error);
        throw error;
    }
}

export async function updateColumn(columnId, data) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // Strapi v5: use documentId directly in URL
        const response = await axios.put(
            `${API_URL}/api/columns/${columnId}`,
            {
                data: {
                    name: data.title
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
        console.error("Error updating column:", error);
        throw error;
    }
}

export async function deleteColumn(columnId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // Strapi v5: use documentId directly in URL
        const response = await axios.delete(
            `${API_URL}/api/columns/${columnId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error deleting column:", error);
        throw error;
    }
}

export async function getColumnsByBoard(boardId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // Get columns with board only
        const url = `${API_URL}/api/columns?populate[0]=board&sort=position:asc`;

        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        // Filter client-side by board documentId
        const allColumns = response.data?.data || [];

        const filteredColumns = allColumns.filter(col => {
            const colBoardId = col.board?.documentId;
            return colBoardId === boardId;
        });

        // Now fetch cards for each column separately
        const columnsWithCards = await Promise.all(
            filteredColumns.map(async (col) => {
                try {
                    const cardsResponse = await axios.get(
                        `${API_URL}/api/cards?filters[column][id][$eq]=${col.id}&sort=position:asc`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );

                    return {
                        ...col,
                        documentId: col.documentId, // Keep documentId for updates/deletes
                        cards: cardsResponse.data?.data || []
                    };
                } catch (error) {
                    console.error(`Error fetching cards for column ${col.id}:`, error);
                    return {
                        ...col,
                        documentId: col.documentId,
                        cards: []
                    };
                }
            })
        );

        return columnsWithCards;
    } catch (error) {
        console.error("Error fetching columns:", error);
        throw error;
    }
}
