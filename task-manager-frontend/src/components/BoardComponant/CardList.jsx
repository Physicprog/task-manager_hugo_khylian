import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column.jsx';
import Card from './Card.jsx';
import { SendNotification } from "../../utils/notifs.js";
import { useDragScroll } from "../../utils/dragUtils.js";
import AddNewColumn from './popUp/listPopUp.jsx';

export default function CardList({ 
    columns = [], 
    onColumnAdd, 
    onColumnEdit, 
    onColumnDelete, 
    onOpenAddCard, 
    onCardClick, 
    onToggleFavorite,
    onMoveCard,
    onMoveColumn 
}) {
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [activeColumn, setActiveColumn] = useState(null);
    const { scrollContainerRef, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useDragScroll();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );

    const columnIds = columns.map(col => col.id);

    function handleAddColumn() {
        if (newColumnTitle.trim()) {
            onColumnAdd && onColumnAdd(newColumnTitle);
            setNewColumnTitle('');
            setIsAddingColumn(false);
        } else {
            SendNotification("Column title cannot be empty", true, false);
        }
    }

    function handleDragStart(event) {
        const { active } = event;
        
        if (active.data.current?.type === "Card") {
            setActiveCard(active.data.current.card);
        } else if (active.data.current?.type === "Column") {
            setActiveColumn(active.data.current.column);
        }
    }

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveACard = active.data.current?.type === "Card";
        const isOverACard = over.data.current?.type === "Card";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveACard) return;

        // Déplacer une carte vers une autre carte (même colonne ou différente)
        if (isActiveACard && isOverACard) {
            const activeColumnIndex = columns.findIndex(col => 
                col.cards.some(card => card.id === activeId)
            );
            const overColumnIndex = columns.findIndex(col => 
                col.cards.some(card => card.id === overId)
            );

            if (activeColumnIndex !== overColumnIndex) {
                return; // Laissé au handleDragEnd pour inter-colonnes
            }

            // Réorganisation dans la même colonne
            const activeColumn = columns[activeColumnIndex];
            const activeCardIndex = activeColumn.cards.findIndex(card => card.id === activeId);
            const overCardIndex = activeColumn.cards.findIndex(card => card.id === overId);

            const newCards = arrayMove(activeColumn.cards, activeCardIndex, overCardIndex);
            
            onMoveCard && onMoveCard(activeId, activeColumn.id, activeColumn.id, newCards);
        }

        // Déplacer une carte vers une colonne vide
        if (isActiveACard && isOverAColumn) {
            const activeColumnIndex = columns.findIndex(col => 
                col.cards.some(card => card.id === activeId)
            );
            const overColumnIndex = columns.findIndex(col => col.id === overId);

            if (activeColumnIndex !== overColumnIndex) {
                const activeColumn = columns[activeColumnIndex];
                const overColumn = columns[overColumnIndex];
                const activeCard = activeColumn.cards.find(card => card.id === activeId);

                const newActiveCards = activeColumn.cards.filter(card => card.id !== activeId);
                const newOverCards = [activeCard, ...overColumn.cards];

                onMoveCard && onMoveCard(activeId, activeColumn.id, overColumn.id, newOverCards, newActiveCards);
            }
        }
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveCard(null);
        setActiveColumn(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveACard = active.data.current?.type === "Card";
        const isOverACard = over.data.current?.type === "Card";
        const isActiveAColumn = active.data.current?.type === "Column";
        const isOverAColumn = over.data.current?.type === "Column";

        // Drag & drop des colonnes
        if (isActiveAColumn && isOverAColumn) {
            const activeColumnIndex = columns.findIndex(col => col.id === activeId);
            const overColumnIndex = columns.findIndex(col => col.id === overId);

            if (activeColumnIndex !== overColumnIndex) {
                const newColumns = arrayMove(columns, activeColumnIndex, overColumnIndex);
                onMoveColumn && onMoveColumn(newColumns);
            }
            return;
        }

        // Drag & drop des cartes (code existant)
        if (isActiveACard && isOverACard) {
            const activeColumnIndex = columns.findIndex(col => 
                col.cards.some(card => card.id === activeId)
            );
            const overColumnIndex = columns.findIndex(col => 
                col.cards.some(card => card.id === overId)
            );

            if (activeColumnIndex !== overColumnIndex) {
                const activeColumn = columns[activeColumnIndex];
                const overColumn = columns[overColumnIndex];
                const activeCard = activeColumn.cards.find(card => card.id === activeId);
                const overCardIndex = overColumn.cards.findIndex(card => card.id === overId);

                const newActiveCards = activeColumn.cards.filter(card => card.id !== activeId);
                const newOverCards = [...overColumn.cards];
                newOverCards.splice(overCardIndex, 0, activeCard);

                onMoveCard && onMoveCard(activeId, activeColumn.id, overColumn.id, newOverCards, newActiveCards);
            }
        }
    }


    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div ref={scrollContainerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
                className="w-full h-[calc(100vh-180px)] overflow-x-auto overflow-y-hidden p-6 bg-surface cursor-grab select-none hide-scrollbar">

                <div className="flex gap-4 h-full">
                    <SortableContext 
                        items={columnIds}
                        strategy={horizontalListSortingStrategy}
                    >
                        {columns.map((column) => (
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

                    <AddNewColumn 
                        isAddingColumn={isAddingColumn} 
                        setIsAddingColumn={setIsAddingColumn} 
                        newColumnTitle={newColumnTitle} 
                        setNewColumnTitle={setNewColumnTitle} 
                        handleAddColumn={handleAddColumn} 
                    />
                </div>
            </div>

            <DragOverlay>
                {activeCard ? (
                    <div className="rotate-3 shadow-2xl">
                        <Card
                            card={activeCard}
                            onClick={() => {}}
                            onToggleFavorite={() => {}}
                        />
                    </div>
                ) : activeColumn ? (
                    <div className="rotate-2 shadow-2xl scale-105">
                        <Column
                            column={activeColumn}
                            onCardClick={() => {}}
                            onOpenAddCard={() => {}}
                            onDeleteColumn={() => {}}
                            onEditColumn={() => {}}
                            onToggleFavorite={() => {}}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
