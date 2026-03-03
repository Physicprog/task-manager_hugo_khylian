import React, { useState } from 'react';
import { SendNotification } from "../../utils/notifs.js";
const Close = "/Close.png";

export default function ColumnDetailPopup({ column, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: column?.title || ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);

    function SwipClose() {
        if (isLoading) return;
        setClosing(true);
        setTimeout(onClose, 300);
    }

    async function handleUpdate() {
        if (!formData.title.trim()) {
            SendNotification("Title is required", true, false);
            return;
        }

        setIsLoading(true);
        try {
            await onUpdate(column.id, formData);
            SwipClose();
        } catch (error) {
            SendNotification("Error updating column");
        } finally {
            setIsLoading(false);
        }
    }

    if (!column) return null;

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`} onClick={SwipClose}>
            <div className="bg-secondary p-6 rounded-lg w-[400px] max-w-[90%] border-2 border-accent1 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-text text-xl font-museo">Edit Column</h2>
                    <button onClick={SwipClose} className="hover:opacity-70 transition" disabled={isLoading}>
                        <img src={Close} alt="Close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="h-[2px] w-full bg-accent1 rounded mb-4"></div>

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="block text-text text-sm mb-1">Column Title</label>
                        <input type="text"value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1"
                            disabled={isLoading} placeholder="Column title" autoFocus/> 
                    </div>

                    <button onClick={handleUpdate} disabled={isLoading} className="w-full px-4 py-2 bg-accent1 text-white rounded hover:opacity-90 disabled:opacity-50 mt-2">
                        {isLoading ? "Updating..." : "Update Column"}
                    </button>
                </div>
            </div>
        </div>
    );
}
