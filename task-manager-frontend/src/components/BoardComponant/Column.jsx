import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
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
        cardIds.push(cardId); //ectrait les IDs des cartes pour les trier
    }
    return cardIds;
}



function getDragColumnClassName(isDragging) {
    /* style lors du drag & drop*/
    if (isDragging) {
        return 'opacity-50 scale-105 rotate-2 shadow-2xl z-50';
    } else {
        return 'hover:shadow-lg';
    }
}

function sortCardsByPosition(cards) {
    /*Trie les cartes par leur position pour les afficher dans le bon ordre */
    const sortedCards = [];
    for (let i = 0; i < cards.length; i++) { 
        sortedCards.push(cards[i]);
    }
    
    sortedCards.sort(function(a, b) { //trie les cartes par position, l'index commence a 0
        const aPosition = a.position || 0;
        const bPosition = b.position || 0;
        return aPosition - bPosition;
        //si a est avant b, retourne un nombre négatif, si a est après b, retourne un nombre positif, sinon 0
        //si le nombre est négatifs, il sera mis avant dans le tableau, sinon après, ce qui permet de trier les cartes par position
    });
    
    return sortedCards;
}

export default function Column({ column, onCardClick, onOpenAddCard, onDeleteColumn, onEditColumn, onToggleFavorite }) {
    const [showMenu, setShowMenu] = useState(false);
    
    function getColumnId(col) {
        return col.documentId || col.id;
    }
    
    const columnId = getColumnId(column);
    
    /* on declare que la colonne est a la fois sortable et droppable pour le drag & drop, et on combine les refs pour les deux */
    const sortable = useSortable({
        id: columnId,
        data: {
            type: "Column",
            column: column,
        }
    });

    const droppable = useDroppable({
        id: columnId,
        data: {
            type: "Column",
            column: column,
        }
    });

    const style = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
    };

    const cardIds = getCardIds(column.cards); //recupere les IDs des cartes de la colonne pour pouvoir les drag & drop dans le bon ordre
    const combineRefs = setRefs(sortable.setNodeRef, droppable.setNodeRef); //setNodeRef est la ref pour le drag & drop, indique que c'est l'element qui sera déplacé
    const dragClassName = getDragColumnClassName(sortable.isDragging); //ajoute des classes de style lors du drag & drop
    
    const columnClass = `flex-shrink-0 w-[280px] bg-secondary rounded-lg p-4 border border-accent1/30 transition-all duration-200 ${dragClassName}`;

    function handleAddCardClickAction() { 
        /* pour ajouter une card*/
        handleAddCardClick(column, onOpenAddCard);
    }

    function renderCards() {
        if (column.cards) {
            const sortedCards = sortCardsByPosition(column.cards);
            const cardElements = [];
            
            for (let i = 0; i < sortedCards.length; i++) { 
                const card = sortedCards[i];
                const cardKey = card.documentId || card.id;
                cardElements.push(<Card key={cardKey} card={card} onClick={onCardClick} onToggleFavorite={onToggleFavorite}/>
                );
            }
            
            return cardElements;
        }
        return [];
    }

    return (
        <div ref={combineRefs} style={style} className={columnClass} data-dnd-kit-sortable="true" data-dnd-kit-droppable="true"
             tabIndex={sortable.attributes && sortable.attributes.tabIndex ? sortable.attributes.tabIndex : 0}
             role={sortable.attributes && sortable.attributes.role ? sortable.attributes.role : 'button'}
             onPointerDown={sortable.listeners && sortable.listeners.onPointerDown ? sortable.listeners.onPointerDown : undefined}>

            <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
                 {...sortable.attributes}
                 {...sortable.listeners}>
                
                <div className="flex items-center gap-2">
                    <h3 className="text-text font-museo text-lg">{column.title}</h3>
                </div>

                <ColumnMenu showMenu={showMenu} setShowMenu={setShowMenu} column={column} onEditColumn={onEditColumn} onDeleteColumn={onDeleteColumn} />
            </div>

            <div className="gap-2 max-h-[calc(100vh-300px)] overflow-y-auto mb-2 min-h-[100px] flex flex-col">
                    {renderCards()}

                
                <div className="flex-shrink-0 max-w-full">
                    <AddNewCard onOpenPopup={handleAddCardClickAction} />
                </div>
            </div>
        </div>
    );
}
