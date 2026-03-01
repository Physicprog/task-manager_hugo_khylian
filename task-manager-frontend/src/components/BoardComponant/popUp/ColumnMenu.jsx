import React from 'react';
const Dots = "/dots.png";

export default function ColumnMenu({ showMenu, setShowMenu, column, onEditColumn, onDeleteColumn }) {
    return (
        <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="hover:opacity-70 transition">
                <img src={Dots} alt="menu" className="w-5 h-5" />
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 bg-secondary border-2 border-accent1 rounded shadow-xl w-36 z-50">
                    <button onClick={() => { onEditColumn && onEditColumn(column); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-text hover:bg-accent1 hover:text-white transition">
                        Edit
                    </button>
                    <div className="h-[1px] bg-accent1/30" />
                    <button onClick={() => { onDeleteColumn && onDeleteColumn(column.id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
