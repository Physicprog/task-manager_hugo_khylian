import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from './Card.jsx';
import ColumnMenu from './popUp/ColumnMenu.jsx';
import AddNewCard from './popUp/AddNewCard.jsx';

export default function Column({ column, onCardClick, onOpenAddCard, onDeleteColumn, onEditColumn, onToggleFavorite }) {
    const [showMenu, setShowMenu] = useState(false);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        }
    });

    const { setNodeRef: setDroppableRef } = useDroppable({
        id: column.id,
        data: {
            type: "Column",
            column,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const cardIds = column.cards?.map(card => card.id) || [];

    // Combine refs
    const setRefs = (element) => {
        setNodeRef(element);
        setDroppableRef(element);
    };

    return (
        <div 
            ref={setRefs}
            style={style}
            className={`flex-shrink-0 w-[280px] bg-secondary rounded-lg p-4 border border-accent1/30 transition-all duration-200 ${
                isDragging ? 'opacity-50 scale-105 rotate-2 shadow-2xl z-50' : 'hover:shadow-lg'
            }`}
        >
            <div 
                {...attributes}
                {...listeners}
                className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-text font-museo text-lg">{column.title}</h3>
                    <span className="text-xs text-gray-400 bg-surface px-2 py-1 rounded">
                        {column.cards?.length || 0}
                    </span>
                </div>

                <ColumnMenu
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    column={column}
                    onEditColumn={onEditColumn}
                    onDeleteColumn={onDeleteColumn}
                />
            </div>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto mb-2 min-h-[50px]">
                <SortableContext 
                    items={cardIds}
                    strategy={verticalListSortingStrategy}
                >
                    {column.cards?.map((card) => (
                        <Card 
                            key={card.id} 
                            card={card} 
                            onClick={onCardClick} 
                            onToggleFavorite={onToggleFavorite} 
                        />
                    ))}
                </SortableContext>
            </div>

            <AddNewCard onOpenPopup={() => onOpenAddCard && onOpenAddCard(column)} />
        </div>
    );
}
