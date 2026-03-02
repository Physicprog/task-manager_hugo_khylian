import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const fav = "/fav.png";
const nofav = "/nofav.png";

const priorityColors = {
    low: 'border-green-500',
    normal: 'border-blue-500',
    high: 'border-yellow-500',
    urgent: 'border-red-500'
};

const labelColors = {
    Red: '#ff4d4d',
    Blue: '#4d79ff',
    Green: '#4dff88',
    Yellow: '#ffd24d',
    Purple: '#b84dff',
    Orange: '#ff944d',
    Pink: '#ff4db6'
};

function formatDate(dateString) {
    if (!dateString) {
        return null;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function handleFavoriteClick(event, card, onToggleFavorite) {
    event.stopPropagation();
    if (onToggleFavorite) {
        onToggleFavorite(card);
    }
}

function handleCardClick(card, onClick) {
    if (onClick) {
        onClick(card);
    }
}

function getPriorityColor(priority) {
    if (priorityColors[priority]) {
        return priorityColors[priority];
    } else {
        return priorityColors.normal;
    }
}

function getFavoriteIcon(isFavorite) {
    if (isFavorite) {
        return fav;
    } else {
        return nofav;
    }
}

function getDragOpacity(isDragging) {
    if (isDragging) {
        return 0.3;
    } else {
        return 1;
    }
}

function getDragClassName(isDragging) {
    if (isDragging) {
        return 'opacity-30 scale-105 z-50';
    } else {
        return '';
    }
}

export default function Card({ card, onClick, onToggleFavorite }) {
    const cardId = card.documentId || card.id;
    const sortable = useSortable({
        id: cardId,
        data: {
            type: "Card",
            card: card,
        }
    });

    const dragOpacity = getDragOpacity(sortable.isDragging);
    const dragClassName = getDragClassName(sortable.isDragging);
    const priorityColor = getPriorityColor(card.priority);
    const favoriteIcon = getFavoriteIcon(card.favorite);

    const style = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
        opacity: dragOpacity,
    };

    const cardClass = `bg-cardBg border-2 ${priorityColor} rounded-xl p-3 cursor-pointer hover:shadow-md transition-all duration-200 relative ${dragClassName}`;

    function onFavoriteClick(e) {
        handleFavoriteClick(e, card, onToggleFavorite);
    }

    function onCardClickHandler() {
        handleCardClick(card, onClick);
    }

    function renderLabels() {
        if (card.labels && card.labels.length > 0) {
            const labelElements = [];
            for (let i = 0; i < card.labels.length; i++) {
                const label = card.labels[i];
                const labelColor = labelColors[label] || '#888';
                labelElements.push(
                    <div key={i} className="px-2 py-0.5 rounded text-white text-xs font-medium" style={{ backgroundColor: labelColor }}>
                        {label}
                    </div>
                );
            }
            return (
                <div className="flex gap-1">
                    {labelElements}
                </div>
            );
        }
        return null;
    }

    function renderDueDate() {
        if (card.dueDate) {
            const formattedDate = formatDate(card.dueDate);
            return <span className="text-xs text-gray-400">{formattedDate}</span>;
        }
        return null;
    }

    function renderDescription() {
        if (card.description) {
            return <p className="text-gray-400 text-xs line-clamp-2 mb-2">{card.description}</p>;
        }
        return null;
    }

    const favoriteLabel = card.favorite ? "Remove from favorites" : "Add to favorites";

    return (
        <div ref={sortable.setNodeRef} style={style} className={cardClass}
             onPointerDown={sortable.listeners && sortable.listeners.onPointerDown ? sortable.listeners.onPointerDown : undefined}
             tabIndex={sortable.attributes && sortable.attributes.tabIndex ? sortable.attributes.tabIndex : 0}
             role={sortable.attributes && sortable.attributes.role ? sortable.attributes.role : 'button'}>
            <button className="absolute top-2 right-2 z-10" onClick={onFavoriteClick} aria-label={favoriteLabel}>
                <img src={favoriteIcon} alt="favorite" className="h-5 w-5" />
            </button>
            
            <div onClick={onCardClickHandler}>
                <h4 className="text-text font-medium text-sm mb-1">{card.title}</h4>
                {renderDescription()}

                <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        {renderLabels()}
                    </div>

                    <div className="flex items-center gap-2">
                        {renderDueDate()}
                        <span className="text-xs text-gray-500 capitalize">{card.priority}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
