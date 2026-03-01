import React from 'react';

export default function AddNewColumn({ isAddingColumn, setIsAddingColumn, newColumnTitle, setNewColumnTitle, handleAddColumn }) {

    return (
        <>
            {!isAddingColumn ? (
                <button onClick={() => setIsAddingColumn(true)} className="flex-shrink-0 w-[280px] h-full bg-secondary/50 hover:bg-secondary border-2 border-dashed border-accent1/30 hover:border-accent1 rounded-lg p-4 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-text">
                    <span className='text-xl'>Add new column</span>
                </button>
            ) : (
                <div className="flex-shrink-0 w-[280px] bg-secondary rounded-lg p-4 border border-accent1/30">
                    <input type="text" value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()} placeholder="Enter column title..." className="w-full px-3 py-2 bg-surface text-text rounded mb-2 text-sm outline-none focus:ring-2 focus:ring-accent1" autoFocus
                    />
                    <div className="flex gap-2">
                        <button onClick={handleAddColumn} className="px-3 py-1 bg-accent1 text-white rounded text-sm hover:opacity-90" >
                            Add
                        </button>
                        <button onClick={() => { setIsAddingColumn(false); setNewColumnTitle(''); }} className="px-3 py-1 bg-surface text-text rounded text-sm hover:opacity-70">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
