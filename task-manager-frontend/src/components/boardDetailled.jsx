import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardDetails } from "../services/boardDetailled.js";
import { createColumn, updateColumn, deleteColumn, getColumnsByBoard } from "../services/columnService.js";
import { createCard, updateCard, deleteCard, moveCard } from "../services/cardService.js";
import SecondaryNavbar from "./BoardComponant/SecondaryNavbar.jsx";
import Navbar from "./navbar.jsx";
import Login from "./login.jsx";
import { getUserInfos, initializeUserData } from "../services/authService.js";
import { removeElements } from "../services/storage.js";
import { SendNotification } from "../utils/notifs.js";
import CardList from "./BoardComponant/CardList.jsx";
import ColumnDetailPopup from "./BoardComponant/ColumnDetailPopup.jsx";
import CardCreatePopup from "./BoardComponant/popUp/CardCreatePopup.jsx";
import CardDetailPopup from "./BoardComponant/CardDetailPopup.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from "./footer.jsx";

export default function DetailledBoards({ isTemplate = false }) {
    const navigate = useNavigate();
    const [boardName, setBoardName] = useState("Loading...");
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [userInfos, setUserInfos] = useState(getUserInfos(null));
    const [columns, setColumns] = useState([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [showColumnPopup, setShowColumnPopup] = useState(false);
    const [showCardCreatePopup, setShowCardCreatePopup] = useState(false);
    const [selectedColumnForCard, setSelectedColumnForCard] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showCardDetailPopup, setShowCardDetailPopup] = useState(false);
    const boardId = useParams().boardId;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            async function init() {
                try {
                    const userData = await initializeUserData();
                    setUser(userData);
                    setUserInfos(getUserInfos(userData));
                } catch (error) {
                    removeElements({ token: 0, userInfo: 0, userGender: 0 });
                }
            }
            init();
        }
    }, []);

    useEffect(() => {
        async function loadBoardName() {
            if (boardId && !isTemplate) {
                const name = await getBoardDetails(boardId, "boardName");
                setBoardName(name || "Unknown Board");
            }
        }
        loadBoardName();
    }, [boardId, isTemplate]);

    useEffect(() => {
        reloadColumns();
    }, [boardId, isTemplate]);

    const handleGoHome = () => {
        navigate('/');
    };

    async function handleLogin(data) {
        if (data?.user) {
            setUser(data.user);
            setUserInfos(getUserInfos(data.user));
        } else {
            SendNotification("Login failed: No user data received", true, false);
        }
        setShowLogin(false);
    }

    function handleLogout() {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
        setUser(null);
        setUserInfos(getUserInfos(null));
        SendNotification("Logged out successfully", true, true);
    }

    async function handleAddColumn(title) {
        if (isTemplate) {
            // Add column in memory only
            const newColumn = {
                id: Date.now() + Math.random(),
                title,
                cards: []
            };
            setColumns([...columns, newColumn]);
            SendNotification("Column added (template mode, not saved)", true, true);
            return;
        }
        try {
            const newColumn = await createColumn(boardId, title);
            setColumns([...columns, {
                id: newColumn.documentId || newColumn.id,
                title: newColumn.name,
                cards: []
            }]);
            SendNotification("Column created successfully", true, true);
        } catch (error) {
            console.error("Error adding column:", error);
            SendNotification("Error creating column", true, false);
        }
    }

    async function handleEditColumn(column) {
        setSelectedColumn(column);
        setShowColumnPopup(true);
    }

    async function handleUpdateColumn(columnId, data) {
        try {
            await updateColumn(columnId, data);
            setColumns(columns.map(col =>
                col.id === columnId ? { ...col, title: data.title } : col
            ));
            SendNotification("Column updated successfully", true, true);
        } catch (error) {
            console.error("Error updating column:", error);
            SendNotification("Error updating column", true, false);
        }
    }

    async function handleDeleteColumn(columnId) {
        if (!window.confirm("Are you sure you want to delete this column? All cards in this column will be deleted.")) {
            return;
        }

        try {
            await deleteColumn(columnId);
            setColumns(columns.filter(col => col.id !== columnId));
            SendNotification("Column deleted successfully", true, true);
        } catch (error) {
            console.error("Error deleting column:", error);
            SendNotification("Error deleting column", true, false);
        }
    }

    function handleOpenAddCard(column) {
        setSelectedColumnForCard(column);
        setShowCardCreatePopup(true);
    }

    async function handleCreateCard(columnId, cardData) {
        if (isTemplate) {
            // Add card in memory only
            setColumns(cols => cols.map(col =>
                col.id === columnId
                    ? { ...col, cards: [...col.cards, { ...cardData, id: Date.now() + Math.random() }] }
                    : col
            ));
            SendNotification("Card added (template mode, not saved)", true, true);
            return;
        }
        try {
            const result = await createCard(columnId, boardId, cardData);
            await reloadColumns();
            SendNotification("Card created successfully", true, true);
        } catch (error) {
            console.error("Error creating card:", error);
            SendNotification("Error creating card", true, false);
            throw error;
        }
    }

    function handleCardClick(card) {
        const column = columns.find(col => col.cards?.some(c => c.id === card.id));
        setSelectedCard(card);
        setSelectedColumn(column);
        setShowCardDetailPopup(true);
    }

    async function handleUpdateCard(cardId, cardData) {
        if (isTemplate) {
            setColumns(cols => cols.map(col => ({
                ...col,
                cards: col.cards.map(card => card.id === cardId ? { ...card, ...cardData } : card)
            })));
            SendNotification("Card updated (template mode, not saved)", true, true);
            return;
        }
        try {
            await updateCard(cardId, cardData);
            await reloadColumns();
            SendNotification("Card updated successfully", true, true);
        } catch (error) {
            console.error("Error updating card:", error);
            SendNotification("Error updating card", true, false);
            throw error;
        }
    }

    async function handleDeleteCard(cardId) {
        if (isTemplate) {
            setColumns(cols => cols.map(col => ({
                ...col,
                cards: col.cards.filter(card => card.id !== cardId)
            })));
            SendNotification("Card deleted (template mode, not saved)", true, true);
            return;
        }
        try {
            await deleteCard(cardId);
            await reloadColumns();
            SendNotification("Card deleted successfully", true, true);
        } catch (error) {
            console.error("Error deleting card:", error);
            SendNotification("Error deleting card", true, false);
            throw error;
        }
    }

    const reloadColumns = useCallback(async () => {
        if (boardId && !isTemplate) {
            try {
                const columnsData = await getColumnsByBoard(boardId);

                const formattedColumns = columnsData.map(col => {
                    const columnName = col.name;
                    const cardsData = col.cards || [];

                    const formattedCards = cardsData.map(card => {
                        return {
                            id: card.documentId || card.id, // Use documentId for operations
                            title: card.title,
                            description: card.description || '',
                            priority: card.priority || 'normal',
                            dueDate: card.dueDate || null,
                            labels: card.labels || null,
                            favorite: card.favorite || false
                        };
                    });

                    return {
                        id: col.documentId || col.id, // Use documentId for operations
                        title: columnName,
                        cards: formattedCards
                    };
                });

                setColumns(formattedColumns);
            } catch (error) {
                console.error("Error reloading columns:", error);
            }
        }
    }, [boardId, isTemplate]);

    // Toggle favorite status for a card
    const handleToggleFavorite = async (card) => {
        // Find the column containing the card
        const colIdx = columns.findIndex(col => col.cards.some(c => c.id === card.id));
        if (colIdx === -1) return;
        const cardIdx = columns[colIdx].cards.findIndex(c => c.id === card.id);
        if (cardIdx === -1) return;

        // Toggle favorite in UI
        const updatedColumns = [...columns];
        const updatedCard = { ...updatedColumns[colIdx].cards[cardIdx], favorite: !updatedColumns[colIdx].cards[cardIdx].favorite };
        updatedColumns[colIdx].cards[cardIdx] = updatedCard;
        setColumns(updatedColumns);

        // Persist favorite status (optional: update backend if you want to save it)
        try {
            await updateCard(card.id, { favorite: updatedCard.favorite });
        } catch (e) {
            // Optionally handle error
        }
    };

    // Handle card movement (drag & drop)
    const handleMoveCard = async (cardId, sourceColumnId, targetColumnId, newTargetCards, newSourceCards = null) => {
        if (isTemplate) {
            // Update UI in template mode
            const updatedColumns = columns.map(col => {
                if (col.id === sourceColumnId && newSourceCards) {
                    return { ...col, cards: newSourceCards };
                }
                if (col.id === targetColumnId) {
                    return { ...col, cards: newTargetCards };
                }
                return col;
            });
            setColumns(updatedColumns);
            SendNotification("Card moved (template mode, not saved)", true, true);
            return;
        }

        try {
            // Update UI immediately for better UX
            const updatedColumns = columns.map(col => {
                if (col.id === sourceColumnId && newSourceCards) {
                    return { ...col, cards: newSourceCards };
                }
                if (col.id === targetColumnId) {
                    return { ...col, cards: newTargetCards };
                }
                return col;
            });
            setColumns(updatedColumns);

            // Save to backend
            const targetPosition = newTargetCards.findIndex(card => card.id === cardId);
            await moveCard(cardId, targetColumnId, targetPosition);

            SendNotification("Card moved successfully", true, true);
        } catch (error) {
            console.error("Error moving card:", error);
            SendNotification("Error moving card", true, false);
            // Revert UI changes on error
            await reloadColumns();
        }
    };

    // Handle column movement (drag & drop)
    const handleMoveColumn = async (newColumns) => {
        if (isTemplate) {
            // Update UI in template mode
            setColumns(newColumns);
            SendNotification("Column moved (template mode, not saved)", true, true);
            return;
        }

        try {
            // Update UI immediately for better UX
            setColumns(newColumns);
            
            // TODO: Implement backend API call to save column order
            // await updateColumnOrder(boardId, newColumns.map((col, index) => ({ id: col.id, position: index })));
            
            SendNotification("Column moved successfully", true, true);
        } catch (error) {
            console.error("Error moving column:", error);
            SendNotification("Error moving column", true, false);
            // Revert UI changes on error
            await reloadColumns();
        }
    };
    const displayedColumns = showOnlyFavorites
        ? columns
            .map(col => ({ ...col, cards: col.cards.filter(card => card.favorite) }))
            .filter(col => col.cards.length > 0)
        : columns;

    return (
        <>
            <Navbar userInfos={userInfos} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} wantToAddSearch={false} isTemplateMode={true} onGoHome={handleGoHome} />

            <SecondaryNavbar boardName={isTemplate ? "Template Board" : boardName} showOnlyFavorites={showOnlyFavorites} setShowOnlyFavorites={setShowOnlyFavorites} />

            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-full">
                    <CardList
                        columns={displayedColumns}
                        onColumnAdd={handleAddColumn}
                        onColumnEdit={handleEditColumn}
                        onColumnDelete={handleDeleteColumn}
                        onOpenAddCard={handleOpenAddCard}
                        onCardClick={handleCardClick}
                        onToggleFavorite={handleToggleFavorite}
                        onMoveCard={handleMoveCard}
                        onMoveColumn={handleMoveColumn}
                    />
                </div>
            </div>

            <Footer WantToAddLink={false} />

            {showLogin && (
                <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
            )}

            {showColumnPopup && selectedColumn && (
                <ColumnDetailPopup
                    column={selectedColumn}
                    onClose={() => {
                        setShowColumnPopup(false);
                        setSelectedColumn(null);
                    }}
                    onUpdate={handleUpdateColumn}
                />
            )}

            {showCardCreatePopup && selectedColumnForCard && (
                <CardCreatePopup
                    column={selectedColumnForCard}
                    onClose={() => {
                        setShowCardCreatePopup(false);
                        setSelectedColumnForCard(null);
                    }}
                    onCreate={handleCreateCard}
                />
            )}

            {showCardDetailPopup && selectedCard && (
                <CardDetailPopup
                    card={selectedCard}
                    column={selectedColumn}
                    onClose={() => {
                        setShowCardDetailPopup(false);
                        setSelectedCard(null);
                        setSelectedColumn(null);
                    }}
                    onUpdate={handleUpdateCard}
                    onDelete={handleDeleteCard}
                />
            )}
        </>
    );
}