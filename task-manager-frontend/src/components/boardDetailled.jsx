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
import Footer from "./footer.jsx";

let idCounter = 1000;

function initializeUser(setUser, setUserInfos) {
    const token = localStorage.getItem("token");
    if (token) {
        loadUserData(setUser, setUserInfos);
    }
}

async function loadUserData(setUser, setUserInfos) {
    try {
        const userData = await initializeUserData();
        setUser(userData);
        setUserInfos(getUserInfos(userData));
    } catch (error) {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
    }
}

function loadBoardName(boardId, isTemplate, setBoardName, navigate) {
    if (boardId && !isTemplate) {
        loadBoardNameFromServer(boardId, setBoardName, navigate);
    }
}

async function loadBoardNameFromServer(boardId, setBoardName, navigate) {
    try {
        const name = await getBoardDetails(boardId, "boardName");
        if (name === null) {
            navigate('/error/401');
            return;
        }
        if (name === "Board not found") {
            navigate('/error/404');
            return;
        }
        if (name === "Server error") {
            navigate('/error/500');
            return;
        }
        if (name) {
            setBoardName(name);
        } else {
            navigate('/error/500');
        }
    } catch (error) {
        console.error("Error loading board name:", error);
        navigate('/error/500');
    }
}

function handleGoHome(navigate) {
    navigate('/');
}

function handleLogin(data, setUser, setUserInfos, setShowLogin) {
    if (data && data.user) {
        setUser(data.user);
        setUserInfos(getUserInfos(data.user));
        setShowLogin(false);
    } else {
        SendNotification("Login failed: No user data received", true, false);
        setShowLogin(false);
    }
}

function handleLogout(setUser, setUserInfos) {
    removeElements({ token: 0, userInfo: 0, userGender: 0 });
    setUser(null);
    setUserInfos(getUserInfos(null));
    SendNotification("Logged out successfully", true, true);
}

function createNewColumn(title) {
    idCounter = idCounter + 1;
    return {
        id: idCounter,
        title: title,
        cards: []
    };
}

async function handleAddColumn(title, isTemplate, boardId, columns, setColumns, navigate) {
    if (isTemplate) {
        addColumnInTemplate(title, columns, setColumns);
        return;
    }
    
    try {
        const newColumn = await createColumn(boardId, title);
        if (newColumn) {
            addColumnToState(newColumn, columns, setColumns);
            SendNotification("Column created successfully", true, true);
        } else {
            SendNotification("Error creating column", true, false);
        }
    } catch (error) {
        console.error("Error adding column:", error);
        if (error.response && error.response.status === 401) {
            navigate('/error/401');
        } else if (error.response && error.response.status === 403) {
            navigate('/error/403');
        } else {
            SendNotification("Error creating column", true, false);
        }
    }
}

function addColumnInTemplate(title, columns, setColumns) {
    const newColumn = createNewColumn(title);
    const updatedColumns = columns.slice();
    updatedColumns.push(newColumn);
    setColumns(updatedColumns);
    SendNotification("Column added (template mode, not saved)", true, true);
}

function addColumnToState(newColumn, columns, setColumns) {
    const columnId = newColumn.documentId || newColumn.id;
    const columnToAdd = {
        id: columnId,
        title: newColumn.name,
        cards: []
    };
    const updatedColumns = columns.slice();
    updatedColumns.push(columnToAdd);
    setColumns(updatedColumns);
}

function handleEditColumn(column, setSelectedColumn, setShowColumnPopup) {
    setSelectedColumn(column);
    setShowColumnPopup(true);
}

async function handleUpdateColumn(columnId, data, columns, setColumns) {
    try {
        await updateColumn(columnId, data);
        updateColumnInState(columnId, data, columns, setColumns);
        SendNotification("Column updated successfully", true, true);
    } catch (error) {
        console.error("Error updating column:", error);
        SendNotification("Error updating column", true, false);
    }
}

function updateColumnInState(columnId, data, columns, setColumns) {
    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.id === columnId) {
            const updatedCol = Object.assign({}, col, { title: data.title });
            updatedColumns.push(updatedCol);
        } else {
            updatedColumns.push(col);
        }
    }
    setColumns(updatedColumns);
}

async function handleDeleteColumn(columnId, columns, setColumns) {
    const userConfirmed = confirm("Are you sure you want to delete this column? All cards in this column will be deleted.");
    if (!userConfirmed) {
        return;
    }

    try {
        await deleteColumn(columnId);
        removeColumnFromState(columnId, columns, setColumns);
        SendNotification("Column deleted successfully", true, true);
    } catch (error) {
        console.error("Error deleting column:", error);
        SendNotification("Error deleting column", true, false);
    }
}

function removeColumnFromState(columnId, columns, setColumns) {
    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.id !== columnId) {
            updatedColumns.push(col);
        }
    }
    setColumns(updatedColumns);
}

function handleOpenAddCard(column, setSelectedColumnForCard, setShowCardCreatePopup) {
    setSelectedColumnForCard(column);
    setShowCardCreatePopup(true);
}

function createNewCard(cardData) {
    idCounter = idCounter + 1;
    const newCard = Object.assign({}, cardData, { id: idCounter });
    return newCard;
}

function addCardToColumn(columns, columnId, card) {
    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.id === columnId) {
            const newCards = col.cards.slice();
            newCards.push(card);
            const updatedCol = Object.assign({}, col, { cards: newCards });
            updatedColumns.push(updatedCol);
        } else {
            updatedColumns.push(col);
        }
    }
    return updatedColumns;
}

async function handleCreateCard(columnId, cardData, isTemplate, boardId, columns, setColumns, reloadColumns) {
    if (isTemplate) {
        const newCard = createNewCard(cardData);
        const updatedColumns = addCardToColumn(columns, columnId, newCard);
        setColumns(updatedColumns);
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

function findCardColumn(columns, cardId) {
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.cards) {
            for (let j = 0; j < col.cards.length; j++) {
                const card = col.cards[j];
                if (card.id === cardId) {
                    return col;
                }
            }
        }
    }
    return null;
}

function handleCardClick(card, columns, setSelectedCard, setSelectedColumn, setShowCardDetailPopup) {
    const column = findCardColumn(columns, card.id);
    setSelectedCard(card);
    setSelectedColumn(column);
    setShowCardDetailPopup(true);
}

function updateCardInColumns(columns, cardId, cardData) {
    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const updatedCards = [];
        for (let j = 0; j < col.cards.length; j++) {
            const card = col.cards[j];
            if (card.id === cardId) {
                const updatedCard = Object.assign({}, card, cardData);
                updatedCards.push(updatedCard);
            } else {
                updatedCards.push(card);
            }
        }
        const updatedCol = Object.assign({}, col, { cards: updatedCards });
        updatedColumns.push(updatedCol);
    }
    return updatedColumns;
}

async function handleUpdateCard(cardId, cardData, isTemplate, columns, setColumns, reloadColumns) {
    if (isTemplate) {
        const updatedColumns = updateCardInColumns(columns, cardId, cardData);
        setColumns(updatedColumns);
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

function removeCardFromColumns(columns, cardId) {
    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const filteredCards = [];
        for (let j = 0; j < col.cards.length; j++) {
            const card = col.cards[j];
            if (card.id !== cardId) {
                filteredCards.push(card);
            }
        }
        const updatedCol = Object.assign({}, col, { cards: filteredCards });
        updatedColumns.push(updatedCol);
    }
    return updatedColumns;
}

async function handleDeleteCard(cardId, isTemplate, columns, setColumns, reloadColumns) {
    if (isTemplate) {
        const updatedColumns = removeCardFromColumns(columns, cardId);
        setColumns(updatedColumns);
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

function formatCard(card) {
    const cardId = card.documentId || card.id;
    const cardTitle = card.title;
    const cardDescription = card.description || '';
    const cardPriority = card.priority || 'normal';
    const cardDueDate = card.dueDate || null;
    const cardLabels = card.labels || null;
    const cardFavorite = card.favorite || false;
    
    return {
        id: cardId,
        title: cardTitle,
        description: cardDescription,
        priority: cardPriority,
        dueDate: cardDueDate,
        labels: cardLabels,
        favorite: cardFavorite
    };
}

function formatColumn(col) {
    const columnId = col.documentId || col.id;
    const columnName = col.name;
    const cardsData = col.cards || [];
    const formattedCards = [];
    
    for (let i = 0; i < cardsData.length; i++) {
        const formattedCard = formatCard(cardsData[i]);
        formattedCards.push(formattedCard);
    }

    return {
        id: columnId,
        title: columnName,
        cards: formattedCards
    };
}

function findCardInColumns(columns, cardId) {
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        for (let j = 0; j < col.cards.length; j++) {
            const card = col.cards[j];
            if (card.id === cardId) {
                return { columnIndex: i, cardIndex: j };
            }
        }
    }
    return { columnIndex: -1, cardIndex: -1 };
}

async function handleToggleFavorite(card, columns, setColumns) {
    const cardLocation = findCardInColumns(columns, card.id);
    const columnIndex = cardLocation.columnIndex;
    const cardIndex = cardLocation.cardIndex;
    
    if (columnIndex === -1 || cardIndex === -1) {
        return;
    }

    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (i === columnIndex) {
            const updatedCards = col.cards.slice();
            const currentCard = updatedCards[cardIndex];
            const updatedCard = Object.assign({}, currentCard, { favorite: !currentCard.favorite });
            updatedCards[cardIndex] = updatedCard;
            const updatedCol = Object.assign({}, col, { cards: updatedCards });
            updatedColumns.push(updatedCol);
        } else {
            updatedColumns.push(col);
        }
    }
    
    setColumns(updatedColumns);

    try {
        await updateCard(card.id, {
            title: card.title,
            description: card.description,
            priority: card.priority,
            dueDate: card.dueDate,
            labels: card.labels,
            favorite: !card.favorite,
            columnId: card.column?.id || card.columnId,
            position: card.position
        });
    } catch (e) {
        console.error("Error updating favorite:", e);
        const revertedColumns = [];
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            if (i === columnIndex) {
                const revertedCards = col.cards.slice();
                revertedCards[cardIndex] = card;
                const revertedCol = Object.assign({}, col, { cards: revertedCards });
                revertedColumns.push(revertedCol);
            } else {
                revertedColumns.push(col);
            }
        }
        setColumns(revertedColumns);
    }
}

function updateColumnsForCardMove(columns, sourceColumnId, targetColumnId, newTargetCards, newSourceCards) {
    const updatedColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.id === sourceColumnId && newSourceCards) {
            const updatedCol = Object.assign({}, col, { cards: newSourceCards });
            updatedColumns.push(updatedCol);
        } else if (col.id === targetColumnId) {
            const updatedCol = Object.assign({}, col, { cards: newTargetCards });
            updatedColumns.push(updatedCol);
        } else {
            updatedColumns.push(col);
        }
    }
    return updatedColumns;
}

async function handleMoveCard(cardId, sourceColumnId, targetColumnId, newTargetCards, newSourceCards, isTemplate, columns, setColumns, reloadColumns) {
    if (isTemplate) {
        const updatedColumns = updateColumnsForCardMove(columns, sourceColumnId, targetColumnId, newTargetCards, newSourceCards);
        setColumns(updatedColumns);
        SendNotification("Card moved (template mode, not saved)", true, true);
        return;
    }

    try {
        const updatedColumns = updateColumnsForCardMove(columns, sourceColumnId, targetColumnId, newTargetCards, newSourceCards);
        setColumns(updatedColumns);

        const targetPosition = findCardPosition(newTargetCards, cardId);
        await moveCard(cardId, targetColumnId, targetPosition);

        SendNotification("Card moved successfully", true, true);
    } catch (error) {
        console.error("Error moving card:", error);
        SendNotification("Error moving card", true, false);
        await reloadColumns();
    }
}

function findCardPosition(cards, cardId) {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
            return i;
        }
    }
    return -1;
}

async function handleMoveColumn(newColumns, isTemplate, setColumns, reloadColumns) {
    if (isTemplate) {
        setColumns(newColumns);
        SendNotification("Column moved (template mode, not saved)", true, true);
        return;
    }

    try {
        setColumns(newColumns);
        SendNotification("Column moved successfully", true, true);
    } catch (error) {
        console.error("Error moving column:", error);
        SendNotification("Error moving column", true, false);
        await reloadColumns();
    }
}

function getDisplayedColumns(columns, showOnlyFavorites) {
    if (showOnlyFavorites) {
        return getFilteredFavoriteColumns(columns);
    } else {
        return columns;
    }
}

function getFilteredFavoriteColumns(columns) {
    const filteredColumns = [];
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const favoriteCards = [];
        for (let j = 0; j < col.cards.length; j++) {
            const card = col.cards[j];
            if (card.favorite) {
                favoriteCards.push(card);
            }
        }
        if (favoriteCards.length > 0) {
            const columnWithFavorites = Object.assign({}, col, { cards: favoriteCards });
            filteredColumns.push(columnWithFavorites);
        }
    }
    return filteredColumns;
}

function closeColumnPopup(setShowColumnPopup, setSelectedColumn) {
    setShowColumnPopup(false);
    setSelectedColumn(null);
}

function closeCardCreatePopup(setShowCardCreatePopup, setSelectedColumnForCard) {
    setShowCardCreatePopup(false);
    setSelectedColumnForCard(null);
}

function closeCardDetailPopup(setShowCardDetailPopup, setSelectedCard, setSelectedColumn) {
    setShowCardDetailPopup(false);
    setSelectedCard(null);
    setSelectedColumn(null);
}

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

    const reloadColumns = useCallback(async function() {
        if (boardId && !isTemplate) {
            await loadColumnsData(boardId, setColumns, navigate);
        }
    }, [boardId, isTemplate, navigate]);

    useEffect(function() {
        initializeUser(setUser, setUserInfos);
    }, []);

    useEffect(function() {
        loadBoardName(boardId, isTemplate, setBoardName, navigate);
    }, [boardId, isTemplate, navigate]);

    useEffect(function() {
        reloadColumns();
    }, [boardId, isTemplate, reloadColumns]);

    const displayedColumns = getDisplayedColumns(columns, showOnlyFavorites);

    function handleLogoutClick() {
        handleLogout(setUser, setUserInfos);
    }

    function handleLoginClick() {
        setShowLogin(true);
    }

    function handleLoginSuccess(data) {
        handleLogin(data, setUser, setUserInfos, setShowLogin);
    }

    function handleLoginClose() {
        setShowLogin(false);
    }

    function handleGoHomeClick() {
        handleGoHome(navigate);
    }

    function handleColumnAddClick(title) {
        handleAddColumn(title, isTemplate, boardId, columns, setColumns, navigate);
    }

    function handleColumnEditClick(column) {
        handleEditColumn(column, setSelectedColumn, setShowColumnPopup);
    }

    function handleColumnDeleteClick(columnId) {
        handleDeleteColumn(columnId, columns, setColumns);
    }

    function handleOpenAddCardClick(column) {
        handleOpenAddCard(column, setSelectedColumnForCard, setShowCardCreatePopup);
    }

    function handleCardClickClick(card) {
        handleCardClick(card, columns, setSelectedCard, setSelectedColumn, setShowCardDetailPopup);
    }

    function handleToggleFavoriteClick(card) {
        handleToggleFavorite(card, columns, setColumns);
    }

    function handleMoveCardClick(cardId, sourceColumnId, targetColumnId, newTargetCards, newSourceCards) {
        handleMoveCard(cardId, sourceColumnId, targetColumnId, newTargetCards, newSourceCards, isTemplate, columns, setColumns, reloadColumns);
    }

    function handleMoveColumnClick(newColumns) {
        handleMoveColumn(newColumns, isTemplate, setColumns, reloadColumns);
    }

    function handleCloseColumnPopup() {
        closeColumnPopup(setShowColumnPopup, setSelectedColumn);
    }

    function handleColumnUpdate(columnId, data) {
        handleUpdateColumn(columnId, data, columns, setColumns);
    }

    function handleCloseCardCreatePopup() {
        closeCardCreatePopup(setShowCardCreatePopup, setSelectedColumnForCard);
    }

    function handleCreateCardClick(columnId, cardData) {
        handleCreateCard(columnId, cardData, isTemplate, boardId, columns, setColumns, reloadColumns);
    }

    function handleCloseCardDetailPopup() {
        closeCardDetailPopup(setShowCardDetailPopup, setSelectedCard, setSelectedColumn);
    }

    function handleCardUpdate(cardId, cardData) {
        handleUpdateCard(cardId, cardData, isTemplate, columns, setColumns, reloadColumns);
    }

    function handleCardDelete(cardId) {
        handleDeleteCard(cardId, isTemplate, columns, setColumns, reloadColumns);
    }

    const boardDisplayName = isTemplate ? "Template Board" : boardName;

    return (
        <>
            <Navbar 
                userInfos={userInfos} 
                onLogout={handleLogoutClick} 
                onLoginClick={handleLoginClick} 
                wantToAddSearch={false} 
                isTemplateMode={true} 
                onGoHome={handleGoHomeClick} 
            />

            <SecondaryNavbar 
                boardName={boardDisplayName} 
                showOnlyFavorites={showOnlyFavorites} 
                setShowOnlyFavorites={setShowOnlyFavorites} 
            />

            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-full">
                    <CardList 
                        columns={displayedColumns} 
                        onColumnAdd={handleColumnAddClick} 
                        onColumnEdit={handleColumnEditClick} 
                        onColumnDelete={handleColumnDeleteClick} 
                        onOpenAddCard={handleOpenAddCardClick} 
                        onCardClick={handleCardClickClick} 
                        onToggleFavorite={handleToggleFavoriteClick} 
                        onMoveCard={handleMoveCardClick} 
                        onMoveColumn={handleMoveColumnClick} 
                    />
                </div>
            </div>

            <Footer WantToAddLink={false} />

            {showLogin && 
                <Login 
                    onLogin={handleLoginSuccess} 
                    onClose={handleLoginClose} 
                />
            }

            {showColumnPopup && selectedColumn && 
                <ColumnDetailPopup 
                    column={selectedColumn} 
                    onClose={handleCloseColumnPopup} 
                    onUpdate={handleColumnUpdate} 
                />
            }

            {showCardCreatePopup && selectedColumnForCard && 
                <CardCreatePopup 
                    column={selectedColumnForCard} 
                    onClose={handleCloseCardCreatePopup} 
                    onCreate={handleCreateCardClick} 
                />
            }

            {showCardDetailPopup && selectedCard && 
                <CardDetailPopup 
                    card={selectedCard} 
                    column={selectedColumn} 
                    onClose={handleCloseCardDetailPopup} 
                    onUpdate={handleCardUpdate} 
                    onDelete={handleCardDelete} 
                />
            }
        </>
    );
}

async function loadColumnsData(boardId, setColumns, navigate) {
    try {
        const columnsData = await getColumnsByBoard(boardId);
        if (columnsData === null) {
            navigate('/error/401');
            return;
        }
        if (columnsData === "Board not found") {
            navigate('/error/404');
            return;
        }
        if (columnsData === "Server error") {
            navigate('/error/500');
            return;
        }
        if (Array.isArray(columnsData)) {
            const formattedColumns = [];
            for (let i = 0; i < columnsData.length; i++) {
                const formattedColumn = formatColumn(columnsData[i]);
                formattedColumns.push(formattedColumn);
            }
            setColumns(formattedColumns);
        } else {
            navigate('/error/500');
        }
    } catch (error) {
        console.error("Error reloading columns:", error);
        navigate('/error/500');
    }
}