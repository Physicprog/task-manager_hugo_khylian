import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card.jsx';
import ColumnMenu from './popUp/ColumnMenu.jsx';
import AddNewCard from './popUp/AddNewCard.jsx';

function setRefs(sortableRef, droppableRef) {
    return function(element) {
        sortableRef(element);
        droppableRef(element);
    };
}

function handleAddCardClick(column, onOpenAddCard) {
    if (onOpenAddCard) {
        onOpenAddCard(column);
    }
}

function getCardIds(cards) {
    if (!cards) {
        return [];
    }
    const cardIds = [];
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardId = card.documentId || card.id;
        cardIds.push(cardId);
    }
    return cardIds;
}



function getDragColumnClassName(isDragging) {
    if (isDragging) {
        return 'opacity-50 scale-105 rotate-2 shadow-2xl z-50';
    } else {
        return 'hover:shadow-lg';
    }
}

function sortCardsByPosition(cards) {
    const sortedCards = [];
    for (let i = 0; i < cards.length; i++) {
        sortedCards.push(cards[i]);
    }
    
    sortedCards.sort(function(a, b) {
        const aPosition = a.position || 0;
        const bPosition = b.position || 0;
        return aPosition - bPosition;
    });
    
    return sortedCards;
}

export default function Column({ column, onCardClick, onOpenAddCard, onDeleteColumn, onEditColumn, onToggleFavorite }) {
    const [showMenu, setShowMenu] = useState(false);
    
    const sortable = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column: column,
        }
    });

    const droppable = useDroppable({
        id: column.id,
        data: {
            type: "Column",
            column: column,
        }
    });

    const style = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
    };

    const cardIds = getCardIds(column.cards);
        const combineRefs = setRefs(sortable.setNodeRef, droppable.setNodeRef);
    const dragClassName = getDragColumnClassName(sortable.isDragging);
    const columnClass = `flex-shrink-0 w-[280px] bg-secondary rounded-lg p-4 border border-accent1/30 transition-all duration-200 ${dragClassName}`;

    function handleAddCardClickAction() {
        handleAddCardClick(column, onOpenAddCard);
    }

    function renderCards() {
        if (column.cards) {
            const sortedCards = sortCardsByPosition(column.cards);
            const cardElements = [];
            
            for (let i = 0; i < sortedCards.length; i++) {
                const card = sortedCards[i];
                const cardKey = card.documentId || card.id;
                cardElements.push(
                    <Card 
                        key={cardKey} 
                        card={card} 
                        onClick={onCardClick} 
                        onToggleFavorite={onToggleFavorite} 
                    />
                );
            }
            
            return cardElements;
        }
        return [];
    }

    return (
        <div ref={combineRefs} style={style} className={columnClass}>
            <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing" 
                 onPointerDown={sortable.listeners && sortable.listeners.onPointerDown ? sortable.listeners.onPointerDown : undefined}
                 tabIndex={sortable.attributes && sortable.attributes.tabIndex ? sortable.attributes.tabIndex : 0}
                 role={sortable.attributes && sortable.attributes.role ? sortable.attributes.role : 'button'}>
                <div className="flex items-center gap-2">
                    <h3 className="text-text font-museo text-lg">{column.title}</h3>
                </div>

                <ColumnMenu 
                    showMenu={showMenu} 
                    setShowMenu={setShowMenu} 
                    column={column} 
                    onEditColumn={onEditColumn} 
                    onDeleteColumn={onDeleteColumn} 
                />
            </div>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto mb-2 min-h-[50px] flex flex-col">
                <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                    {renderCards()}
                </SortableContext>
                
                <div className="flex-shrink-0 max-w-full">
                    <AddNewCard onOpenPopup={handleAddCardClickAction} />
                </div>
            </div>
        </div>
    );
}
