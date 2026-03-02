import React, { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column.jsx';
import Card from './Card.jsx';
import { SendNotification } from "../../utils/notifs.js";
import { useDragScroll } from "../../utils/dragUtils.js";
import AddNewColumn from './popUp/listPopUp.jsx';

function getCardId(card) {
    if (card.documentId) {
        return card.documentId;
    } else {
        return card.id;
    }
}

function findColumnByCardId(columns, cardId) {
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.cards) {
            for (let j = 0; j < col.cards.length; j++) {
                const card = col.cards[j];
                if (getCardId(card) === cardId) {
                    return i;
                }
            }
        }
    }
    return -1;
}

function handleAddColumn(newColumnTitle, isAddingColumn, onColumnAdd, setNewColumnTitle, setIsAddingColumn) {
    const trimmedTitle = newColumnTitle.trim();
    if (trimmedTitle) {
        if (onColumnAdd) {
            onColumnAdd(newColumnTitle);
        }
        setNewColumnTitle('');
        setIsAddingColumn(false);
    } else {
        SendNotification("Column title cannot be empty", true, false);
    }
}

function handleDragStart(event, setActiveCard, setActiveColumn) {
    const activeType = event.active.data.current;
    if (activeType) {
        const type = activeType.type;
        if (type === "Card") {
            setActiveCard(activeType.card);
        } else if (type === "Column") {
            setActiveColumn(activeType.column);
        }
    }
}

function findCardIndex(cards, cardId) {
    for (let i = 0; i < cards.length; i++) {
        if (getCardId(cards[i]) === cardId) {
            return i;
        }
    }
    return -1;
}

function moveCardInArray(cards, fromIndex, toIndex) {
    const newCards = [];
    for (let i = 0; i < cards.length; i++) {
        newCards.push(cards[i]);
    }
    const cardToMove = newCards[fromIndex];
    newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, cardToMove);
    return newCards;
}

function handleCardDragOver(activeId, overId, columns, onMoveCard, isActiveACard, isOverACard, isOverAColumn) {
    if (!isActiveACard) {
        return;
    }

    if (isActiveACard && isOverACard) {
        const activeColumnIndex = findColumnByCardId(columns, activeId);
        const overColumnIndex = findColumnByCardId(columns, overId);

        if (activeColumnIndex !== overColumnIndex) {
            return;
        }

        const activeColumn = columns[activeColumnIndex];
        const activeCardIndex = findCardIndex(activeColumn.cards, activeId);
        const overCardIndex = findCardIndex(activeColumn.cards, overId);
        const newCards = moveCardInArray(activeColumn.cards, activeCardIndex, overCardIndex);
        
        if (onMoveCard) {
            onMoveCard(activeId, activeColumn.id, activeColumn.id, newCards);
        }
    }

    if (isActiveACard && isOverAColumn) {
        const activeColumnIndex = findColumnByCardId(columns, activeId);
        const overColumnIndex = findColumnIndexById(columns, overId);

        if (activeColumnIndex !== overColumnIndex) {
            const activeColumn = columns[activeColumnIndex];
            const overColumn = columns[overColumnIndex];
            const activeCard = findCardById(activeColumn.cards, activeId);

            const newActiveCards = removeCardFromCards(activeColumn.cards, activeId);
            const newOverCards = [activeCard];
            for (let i = 0; i < overColumn.cards.length; i++) {
                newOverCards.push(overColumn.cards[i]);
            }

            if (onMoveCard) {
                onMoveCard(activeId, activeColumn.id, overColumn.id, newOverCards, newActiveCards);
            }
        }
    }
}

function findColumnIndexById(columns, columnId) {
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].id === columnId) {
            return i;
        }
    }
    return -1;
}

function findCardById(cards, cardId) {
    for (let i = 0; i < cards.length; i++) {
        if (getCardId(cards[i]) === cardId) {
            return cards[i];
        }
    }
    return null;
}

function removeCardFromCards(cards, cardId) {
    const newCards = [];
    for (let i = 0; i < cards.length; i++) {
        if (getCardId(cards[i]) !== cardId) {
            newCards.push(cards[i]);
        }
    }
    return newCards;
}

function handleDragOver(event, columns, onMoveCard) {
    if (!event.over) {
        return;
    }

    const activeId = event.active.id;
    const overId = event.over.id;

    if (activeId === overId) {
        return;
    }

    const activeData = event.active.data.current;
    const overData = event.over.data.current;
    
    const isActiveACard = activeData && activeData.type === "Card";
    const isOverACard = overData && overData.type === "Card";
    const isOverAColumn = overData && overData.type === "Column";

    handleCardDragOver(activeId, overId, columns, onMoveCard, isActiveACard, isOverACard, isOverAColumn);
}

function moveColumnsInArray(columns, fromIndex, toIndex) {
    const newColumns = [];
    for (let i = 0; i < columns.length; i++) {
        newColumns.push(columns[i]);
    }
    const columnToMove = newColumns[fromIndex];
    newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, columnToMove);
    return newColumns;
}

function handleColumnDragEnd(activeId, overId, columns, onMoveColumn) {
    const activeColumnIndex = findColumnIndexById(columns, activeId);
    const overColumnIndex = findColumnIndexById(columns, overId);

    if (activeColumnIndex !== overColumnIndex) {
        const newColumns = moveColumnsInArray(columns, activeColumnIndex, overColumnIndex);
        if (onMoveColumn) {
            onMoveColumn(newColumns);
        }
    }
}

function handleCardDragEnd(activeId, overId, columns, onMoveCard) {
    const activeColumnIndex = findColumnByCardId(columns, activeId);
    const overColumnIndex = findColumnByCardId(columns, overId);

    if (activeColumnIndex !== overColumnIndex) {
        const activeColumn = columns[activeColumnIndex];
        const overColumn = columns[overColumnIndex];
        const activeCard = findCardById(activeColumn.cards, activeId);
        const overCardIndex = findCardIndex(overColumn.cards, overId);

        const newActiveCards = removeCardFromCards(activeColumn.cards, activeId);
        const newOverCards = [];
        for (let i = 0; i < overColumn.cards.length; i++) {
            newOverCards.push(overColumn.cards[i]);
        }
        newOverCards.splice(overCardIndex, 0, activeCard);

        if (onMoveCard) {
            onMoveCard(activeId, activeColumn.id, overColumn.id, newOverCards, newActiveCards);
        }
    }
}

function handleDragEnd(event, setActiveCard, setActiveColumn, columns, onMoveColumn, onMoveCard) {
    setActiveCard(null);
    setActiveColumn(null);

    if (!event.over) {
        return;
    }

    const activeId = event.active.id;
    const overId = event.over.id;

    if (activeId === overId) {
        return;
    }

    const activeData = event.active.data.current;
    const overData = event.over.data.current;
    
    const isActiveACard = activeData && activeData.type === "Card";
    const isOverACard = overData && overData.type === "Card";
    const isActiveAColumn = activeData && activeData.type === "Column";
    const isOverAColumn = overData && overData.type === "Column";

    if (isActiveAColumn && isOverAColumn) {
        handleColumnDragEnd(activeId, overId, columns, onMoveColumn);
        return;
    }

    if (isActiveACard && isOverACard) {
        handleCardDragEnd(activeId, overId, columns, onMoveCard);
    }
}

export default function CardList({ columns = [], onColumnAdd, onColumnEdit, onColumnDelete, onOpenAddCard, onCardClick, onToggleFavorite, onMoveCard, onMoveColumn }) {
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [activeColumn, setActiveColumn] = useState(null);
    
    const dragScroll = useDragScroll();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));
    
    const columnIds = [];
    for (let i = 0; i < columns.length; i++) {
        columnIds.push(columns[i].id);
    }

    function onAddColumn() {
        handleAddColumn(newColumnTitle, isAddingColumn, onColumnAdd, setNewColumnTitle, setIsAddingColumn);
    }

    function onDragStart(event) {
        handleDragStart(event, setActiveCard, setActiveColumn);
    }

    function onDragOver(event) {
        handleDragOver(event, columns, onMoveCard);
    }

    function onDragEnd(event) {
        handleDragEnd(event, setActiveCard, setActiveColumn, columns, onMoveColumn, onMoveCard);
    }

    const columnElements = [];
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        columnElements.push(
            <Column 
                key={column.id} 
                column={column} 
                onCardClick={onCardClick} 
                onOpenAddCard={onOpenAddCard} 
                onDeleteColumn={onColumnDelete} 
                onEditColumn={onColumnEdit} 
                onToggleFavorite={onToggleFavorite} 
            />
        );
    }

    function renderActiveOverlay() {
        if (activeCard) {
            return (
                <div className="rotate-3 shadow-2xl">
                    <Card card={activeCard} onClick={function(){}} onToggleFavorite={function(){}} />
                </div>
            );
        } else if (activeColumn) {
            return (
                <div className="rotate-2 shadow-2xl scale-105">
                    <Column 
                        column={activeColumn} 
                        onCardClick={function(){}} 
                        onOpenAddCard={function(){}} 
                        onDeleteColumn={function(){}} 
                        onEditColumn={function(){}} 
                        onToggleFavorite={function(){}} 
                    />
                </div>
            );
        } else {
            return null;
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
            <div ref={dragScroll.scrollContainerRef} onMouseDown={dragScroll.handleMouseDown} onMouseMove={dragScroll.handleMouseMove} onMouseUp={dragScroll.handleMouseUp} onMouseLeave={dragScroll.handleMouseLeave} className="w-full h-[calc(100vh-180px)] overflow-x-auto overflow-y-hidden p-6 bg-surface cursor-grab select-none hide-scrollbar">
                <div className="flex gap-4 h-full">
                    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                        {columnElements}
                    </SortableContext>

                    <AddNewColumn 
                        isAddingColumn={isAddingColumn} 
                        setIsAddingColumn={setIsAddingColumn} 
                        newColumnTitle={newColumnTitle} 
                        setNewColumnTitle={setNewColumnTitle} 
                        handleAddColumn={onAddColumn} 
                    />
                </div>
            </div>

            <DragOverlay>
                {renderActiveOverlay()}
            </DragOverlay>
        </DndContext>
    );
}
