import React, { useState } from 'react';
import { SendNotification } from "../../../utils/notifs.js";
const Close = "/Close.png";

export default function CardCreatePopup({ column, onClose, onCreate }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'normal',
        dueDate: '',
        label: '',
        favorite: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);

    const labelColors = {
        Red: '#ff4d4d',
        Blue: '#4d79ff',
        Green: '#4dff88',
        Yellow: '#ffd24d',
        Purple: '#b84dff',
        Orange: '#ff944d',
        Pink: '#ff4db6'
    };

    function SwipClose() {
        if (isLoading) return;
        setClosing(true);
        setTimeout(onClose, 300);
    }

    async function handleCreate() {
        if (!formData.title.trim()) {
            SendNotification("Title is required", true, false);
            return;
        }

        setIsLoading(true);
        try {
            await onCreate(column.id, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                labels: formData.label ? [formData.label] : null,
                favorite: formData.favorite
            });
            SendNotification("Card created successfully", true, true);
            SwipClose();
        } catch (error) {
            SendNotification("Error creating card", true, false);
        } finally {
            setIsLoading(false);
        }
    }
                <div className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.favorite} onChange={e => setFormData({ ...formData, favorite: e.target.checked })}
                        disabled={isLoading} id="favorite-checkbox"/>
                    <label className="text-text text-sm">Favorite</label>
                </div> //en dehors du return

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`} onClick={SwipClose}>
            <div className="bg-secondary p-6 rounded-lg w-[500px] max-w-[90%] border-2 border-accent1 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-text text-xl font-museo">Create New Card</h2>
                    <button onClick={SwipClose} className="hover:opacity-70 transition" disabled={isLoading}>
                        <img src={Close} alt="Close" className="w-6 h-6" />
                    </button>
                </div>

                <div className="h-[2px] w-full bg-accent1 rounded mb-4"></div>

                <div className="flex flex-col gap-3">


                    <div>
                        <label className="block text-text text-sm mb-1">Title *</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1" disabled={isLoading}
                            placeholder="Enter card title" autoFocus />
                    </div>

                    <div>
                        <label className="block text-text text-sm mb-1">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1 resize-none"
                            disabled={isLoading} placeholder="Enter card description" rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-text text-sm mb-1">Priority</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1" disabled={isLoading} >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-text text-sm mb-1">Label</label>
                            <select value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1" disabled={isLoading} >
                                <option value="">No label</option>
                                {Object.keys(labelColors).map(label => ( // dictionnaire de labels, on affiche en prenant les clefs
                                    <option key={label} value={label}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-text text-sm mb-1">Due Date</label>
                        <input type="date" value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} //... sert a garder les autres champs du formData inchangés, on ne modifie que le dueDate
                            className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1" disabled={isLoading} />
                    </div>

                    <button onClick={handleCreate} disabled={isLoading} className="w-full px-4 py-2 bg-accent1 text-white rounded hover:opacity-90 disabled:opacity-50 mt-2" >
                        {isLoading ? "Creating..." : "Create Card"}
                    </button>
                </div>
            </div>
        </div>
    );
}
