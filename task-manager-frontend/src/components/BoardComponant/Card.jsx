import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useState } from 'react';
const fav = "/fav.png";
const nofav = "/nofav.png";

export default function Card({ card, onClick, onToggleFavorite }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const priorityColors = {
        low: 'border-l-green-500',
        normal: 'border-l-blue-500',
        high: 'border-l-yellow-500',
        urgent: 'border-l-red-500'
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

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-cardBg border-l-4 ${priorityColors[card.priority] || priorityColors.normal} rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 relative ${
                isDragging ? 'opacity-30 scale-105 z-50' : ''
            }`}
        >
            <button
                className="absolute top-2 right-2 z-10"
                onClick={e => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(card); }}
                aria-label={card.favorite ? "Remove from favorites" : "Add to favorites"}
            >
                <img src={card.favorite ? fav : nofav} alt="favorite" className="h-5 w-5" />
            </button>
            <div onClick={() => onClick && onClick(card)}>
                <h4 className="text-text font-medium text-sm mb-1">{card.title}</h4>
                {card.description && (
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2">{card.description}</p>
                )}

                <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        {card.labels && card.labels.length > 0 && (
                            <div className="flex gap-1">
                                {card.labels.map((label, index) => (
                                    <div
                                        key={index}
                                        className="px-2 py-0.5 rounded text-white text-xs font-medium"
                                        style={{ backgroundColor: labelColors[label] || '#888' }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {card.dueDate && (
                            <span className="text-xs text-gray-400">
                                📅 {formatDate(card.dueDate)}
                            </span>
                        )}
                        <span className="text-xs text-gray-500 capitalize">{card.priority}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
