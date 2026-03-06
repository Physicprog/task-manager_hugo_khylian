import React from 'react';
import { useSortable } from '@dnd-kit/sortable'; //permet de faire des échanges en gardant les positions 
import { CSS } from '@dnd-kit/utilities'; //necessaire pour faire le style de l'élément en cours de drag

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
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function getPriorityColor(priority) {
    if (priorityColors[priority]){
         return priorityColors[priority]
    }else{
        return priorityColors['normal'];
    }
}

function getFavoriteIcon(isFavorite) {
    if (isFavorite) return fav;
    return nofav;
}

export default function Card({ card, onClick, onToggleFavorite }) {
    const cardId = card.documentId || card.id;
    const priorityColor = getPriorityColor(card.priority);
    const favoriteIcon = getFavoriteIcon(card.favorite);
    const favoriteLabel = card.favorite ? "Remove from favorites" : "Add to favorites";

    const sortable = useSortable({
        id: cardId,
        data: {type: "Card",card: card,}
    });

    const style = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
    };

    function onFavoriteClick(e) {
        e.stopPropagation();
        if (onToggleFavorite) onToggleFavorite(card);
    }

    function onCardClickHandler() {
        if (onClick) onClick(card);
    }

    function renderLabels() {
        if (card.labels && card.labels.length > 0) {
            const labelElements = [];
            for (let i = 0; i < card.labels.length; i++) {
                const label = card.labels[i];
                const labelColor = labelColors[label] || '#888';
                labelElements.push(
                    <div key={i} className="px-[10vh] py-1 rounded text-white text-xs font-medium" style={{ backgroundColor: labelColor }}>
                    </div>
                );
            }
            return <div className="flex gap-1">{labelElements}</div>;
        }
        return null;
    }

    function renderDueDate() {
        if (card.dueDate) {
            return <span className="text-xs text-gray-400">{formatDate(card.dueDate)}</span>;
        }
        return null;
    }

    function renderDescription() {
        if (card.description) {
            return <p className="text-gray-400 text-xs line-clamp-2 mb-2">{card.description}</p>;
        }
        return null;
    }

    const dragClassName = sortable.isDragging ? 'opacity-50 scale-105' : 'hover:shadow-md';
    
    const cardClass = `bg-cardBg border-2 ${priorityColor} rounded-xl p-3 cursor-pointer transition-all duration-200 relative ${dragClassName}`;

    return (
        <div ref={sortable.setNodeRef} style={style} className={cardClass} data-dnd-kit-sortable="true"
            tabIndex={sortable.attributes && sortable.attributes.tabIndex ? sortable.attributes.tabIndex : 0} //rend focusable pour le clavier
            role={sortable.attributes && sortable.attributes.role ? sortable.attributes.role : 'button'} //role de button pour les lecteurs d'écran
            onPointerDown={sortable.listeners && sortable.listeners.onPointerDown ? sortable.listeners.onPointerDown : undefined}>{/*onPointerDown pour le drag & drop*/}
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