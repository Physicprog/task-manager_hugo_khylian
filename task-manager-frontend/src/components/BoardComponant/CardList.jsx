import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column.jsx';
import Card from './Card.jsx';
import { SendNotification } from "../../utils/notifs.js";
import { useDragScroll } from "../../utils/dragUtils.js";
import AddNewColumn from './popUp/listPopUp.jsx';

export default function CardList({ columns = [],  onColumnAdd, onColumnEdit, onColumnDelete, onOpenAddCard, onCardClick,onToggleFavorite, onMoveCard, onMoveColumn}) {

    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [activeColumn, setActiveColumn] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const dragScroll = useDragScroll();

    const sensors = useSensors(
        useSensor(PointerSensor, { 
            activationConstraint: { 
                distance: 8, //marge de mouvement de 8px pour que le images ne bloquent pas
            } 
        })
    );

    function getCardId(card) {
        return card.documentId || card.id;
    };

    function getColumnId(column) {
        return column.documentId || column.id;
    };

    function findColumnByCardId(cardId) {
        for (let i = 0; i < columns.length; i++) { //on prend l'id de la carte et on cherche dans chaque colonne par alitération
            const column = columns[i];
            if (column.cards) {
                for (let j = 0; j < column.cards.length; j++) {
                    if (getCardId(column.cards[j]) === cardId) { //si on trouve la carte dans la colonne
                        return column;
                    }
                }
            }
        }
        return null;
    };

    function findColumnById(columnId) {
        for (let i = 0; i < columns.length; i++) {
            const colId = getColumnId(columns[i]);
            if (colId === columnId) {
                return columns[i];
            }
        }
        return null;
    };

    function handleAddColumn() {
        const title = newColumnTitle.trim(); 
        if (title) {
            if (onColumnAdd) {
                onColumnAdd(title);
            }
            setNewColumnTitle('');
            setIsAddingColumn(false);
        } else {
            SendNotification("Column title cannot be empty", true, false);
        }
    };

    function handleDragStart(event) {
        const activeData = event.active.data.current;
        setIsDragging(true);
        
        if (activeData && activeData.type === "Card") {
            setActiveCard(activeData.card);
        } else if (activeData && activeData.type === "Column") {
            setActiveColumn(activeData.column);
        }
    };

    const handleDragOver = (event) => {
    };

    const handleDragEnd = (event) => {
        
        setActiveCard(null);
        setActiveColumn(null);
        setIsDragging(false);

        if (!event.over) {
            return;
        }

        const activeId = event.active.id;
        const overId = event.over.id;

        if (activeId === overId) { //si on drop sur le même élément, on ne fait rien
            return;
        }

        const activeData = event.active.data.current;
        const overData = event.over.data.current;

        if (!activeData) {
            return;
        }

        try {
            if (activeData.type === "Column" && onMoveColumn) { //si on déplace une colonne
                // Vérifier si on drop sur une autre colonne ou dans le container
                const isValidDrop = !overData || overData.type === "Column";
                
                if (isValidDrop) {
                    let activeIndex = -1;
                    let overIndex = -1;

                    for (let i = 0; i < columns.length; i++) { //on verfie que la colonne déplacée et ou on drop est bien dans la liste des colonnes
                        const colId = getColumnId(columns[i]);
                        if (colId === activeId) activeIndex = i; 
                        if (colId === overId) overIndex = i;
                    }

                    if (activeIndex !== -1) {
                        // Si on ne trouve pas l'overIndex, on met à la fin
                        if (overIndex === -1) {
                            overIndex = columns.length - 1;
                        }
                        
                        if (activeIndex !== overIndex) {
                            const newColumns = [...columns];
                            const [movedColumn] = newColumns.splice(activeIndex, 1);
                            newColumns.splice(overIndex, 0, movedColumn);
                            onMoveColumn(newColumns);
                        }
                    }
                }
                return;
            }

            if (activeData.type === "Card" && overData?.type === "Card" && onMoveCard) {
                const activeColumn = findColumnByCardId(activeId);
                const overColumn = findColumnByCardId(overId);

                if (activeColumn && overColumn) {

                    if (activeColumn.id === overColumn.id) {
                        let activeIndex = -1;
                        let overIndex = -1;

                        for (let i = 0; i < activeColumn.cards.length; i++) {
                            if (getCardId(activeColumn.cards[i]) === activeId) activeIndex = i;
                            if (getCardId(activeColumn.cards[i]) === overId) overIndex = i;
                        }


                        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                            const newCards = [...activeColumn.cards];
                            const [movedCard] = newCards.splice(activeIndex, 1);
                            newCards.splice(overIndex, 0, movedCard);
                            onMoveCard(activeId, activeColumn.id, activeColumn.id, newCards);
                        }
                    } else {
                        const activeCard = activeColumn.cards.find(card => getCardId(card) === activeId);
                        if (activeCard) {
                            const newSourceCards = activeColumn.cards.filter(card => getCardId(card) !== activeId);
                            const newTargetCards = [activeCard, ...overColumn.cards];
                            onMoveCard(activeId, activeColumn.id, overColumn.id, newTargetCards, newSourceCards);
                        }
                    }
                }
                return;
            }

            if (activeData.type === "Card" && overData?.type === "Column" && onMoveCard) {
                const activeColumn = findColumnByCardId(activeId);
                const targetColumn = findColumnById(overId);

                if (activeColumn && targetColumn && activeColumn.id !== targetColumn.id) {
                    const activeCard = activeColumn.cards.find(card => getCardId(card) === activeId);
                    if (activeCard) {
                        const newSourceCards = activeColumn.cards.filter(card => getCardId(card) !== activeId);
                        const newTargetCards = [...targetColumn.cards, activeCard];
                        onMoveCard(activeId, activeColumn.id, targetColumn.id, newTargetCards, newSourceCards);
                    }
                }
                return;
            }

        } catch (error) {
        }
    };

    const columnIds = columns.map(column => getColumnId(column));

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {/* Container principal avec scroll horizontal */}
            <div 
                ref={dragScroll.scrollContainerRef}
                onMouseDown={dragScroll.handleMouseDown}
                onMouseMove={dragScroll.handleMouseMove}
                onMouseUp={dragScroll.handleMouseUp}
                onMouseLeave={dragScroll.handleMouseLeave}
                className="w-full h-[calc(100vh-180px)] horizontal-scroll p-6 bg-surface cursor-grab select-none"
            >
                <div className="flex gap-4 h-full" style={{ minWidth: 'max-content' }}>
                    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                        {/* Affichage des colonnes */}
                        {columns.map(column => (
                            <Column
                                key={column.id}
                                column={column}
                                onCardClick={onCardClick}
                                onOpenAddCard={onOpenAddCard}
                                onDeleteColumn={onColumnDelete}
                                onEditColumn={onColumnEdit}
                                onToggleFavorite={onToggleFavorite}
                            />
                        ))}
                    </SortableContext>

                    {/* Bouton pour ajouter une nouvelle colonne */}
                    <AddNewColumn
                        isAddingColumn={isAddingColumn}
                        setIsAddingColumn={setIsAddingColumn}
                        newColumnTitle={newColumnTitle}
                        setNewColumnTitle={setNewColumnTitle}
                        handleAddColumn={handleAddColumn}
                    />
                </div>
            </div>

            {/* Overlay pour montrer l'élément en cours de drag */}
            <DragOverlay>
                {activeCard && (
                    <Card 
                        card={activeCard} 
                        onClick={() => {}} 
                        onToggleFavorite={() => {}} 
                    />
                )}
                {activeColumn && (
                    <Column
                        column={activeColumn}
                        onCardClick={() => {}}
                        onOpenAddCard={() => {}}
                        onDeleteColumn={() => {}}
                        onEditColumn={() => {}}
                        onToggleFavorite={() => {}}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}
