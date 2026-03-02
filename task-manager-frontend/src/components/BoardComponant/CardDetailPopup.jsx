import React, { useState } from 'react';
import { SendNotification } from "../../utils/notifs.js";
const Close = "/Close.png";

export default function CardDetailPopup({ card, column, onClose, onUpdate, onDelete }) {
    const [formData, setFormData] = useState({
        title: card?.title || '',
        description: card?.description || '',
        priority: card?.priority || 'normal',
        dueDate: card?.dueDate || '',
        label: card?.labels?.[0] || '',
        favorite: card?.favorite || false
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

    const priorityColors = {
        low: 'border-green-500',
        normal: 'border-blue-500',
        high: 'border-yellow-500',
        urgent: 'border-red-500'
    };

    function SwipClose() {
        setClosing(true);
        setTimeout(onClose, 300);
    }

    if (!card) return null;

    async function handleUpdate() {
        if (!formData.title.trim()) {
            SendNotification("Title is required", true, false);
            return;
        }

        setIsLoading(true);
        try {
            await onUpdate(card.id, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                labels: formData.label ? [formData.label] : null,
                favorite: formData.favorite,
                columnId: card.column?.id || column?.id,
                position: card.position
            });
            SwipClose();
        } catch (error) {
            console.error('Error updating card:', error);
            SendNotification("Error updating card", true, false);
        } finally {
            setIsLoading(false);
        }
    }
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={formData.favorite}
                        onChange={e => setFormData(Object.assign({}, formData, { favorite: e.target.checked }))}
                        disabled={isLoading}
                        id="favorite-checkbox-detail"
                    />
                    <label htmlFor="favorite-checkbox-detail" className="text-text text-sm">Favorite</label>
                </div>

    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this card?")) return;

        setIsLoading(true);
        try {
            await onDelete(card.id);
            SwipClose();
        } catch (error) {
            console.error('Error deleting card:', error);
            SendNotification("Error deleting card", true, false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`} onClick={SwipClose}>
            <div className="bg-secondary p-6 rounded-lg w-[500px] max-w-[90%] border border-accent1 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-text text-xl font-museo">Card Details</h2>
                    <button onClick={SwipClose} className="hover:opacity-70 transition" disabled={isLoading}>
                        <img src={Close} alt="Close" className="w-6 h-6" />
                    </button>
                </div>

                    <div>
                        <label className="block text-text text-sm mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(Object.assign({}, formData, { title: e.target.value }))}
                            className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1"
                            disabled={isLoading}
                            placeholder="Card title"
                        />
                    </div>

                    <div>
                        <label className="block text-text text-sm mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(Object.assign({}, formData, { description: e.target.value }))}
                            className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1 resize-none"
                            disabled={isLoading}
                            placeholder="Card description"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-text text-sm mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData(Object.assign({}, formData, { priority: e.target.value }))}
                                className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1"
                                disabled={isLoading}
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-text text-sm mb-1">Label</label>
                            <select
                                value={formData.label}
                                onChange={(e) => setFormData(Object.assign({}, formData, { label: e.target.value }))}
                                className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1"
                                disabled={isLoading}
                            >
                                <option value="">No label</option>
                                {Object.keys(labelColors).map(label => (
                                    <option key={label} value={label}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-text text-sm mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData(Object.assign({}, formData, { dueDate: e.target.value }))}
                            className="w-full px-3 py-2 bg-surface text-text rounded outline-none focus:ring-2 focus:ring-accent1"
                            disabled={isLoading}
                        />
                    </div>


                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-accent1 text-white rounded hover:opacity-90 disabled:opacity-50"
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
    );
}
