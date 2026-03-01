import React from 'react';

export default function AddNewCard({ onOpenPopup }) {
    return (
        <button onClick={onOpenPopup} className="w-full bg-surface text-left px-3 py-2 text-gray-400 hover:text-text hover:bg-secondary rounded transition text-sm">
            + Add new card
        </button>
    );
}
