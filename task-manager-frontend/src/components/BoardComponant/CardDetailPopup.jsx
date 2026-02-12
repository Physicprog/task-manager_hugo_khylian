import React, { useState } from 'react';
import { SendNotification } from "../../utils/notifs.js";
const Close = "/Close.png";

export default function CardDetailPopup({ card, column, onClose, onUpdate, onDelete }) {
    const [formData, setFormData] = useState({
        title: card?.title || "",
        description: card?.description || "",
        priority: card?.priority || "normal"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);

    const labelClasses = {
        red: "bg-label-red",
        blue: "bg-label-blue",
        green: "bg-label-green",
        yellow: "bg-label-yellow",
        purple: "bg-label-purple",
        orange: "bg-label-orange",
        pink: "bg-label-pink",
    };


    function SwipClose() {
        setClosing(true);
        setTimeout(onClose, 300);
    }

    /*
        async function handleDelete() {
            if (!window.confirm("Are you sure you want to delete this card?")) return;
    
            setIsLoading(true);
            try {
                await onDelete(card.id);
                SendNotification("Card deleted successfully");
                SwipClose();
            } catch (error) {
                console.error('Error deleting card:', error);
                SendNotification("Error deleting card");
            } finally {
                setIsLoading(false);
            }
        }
    */

    if (!card) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`}>
            <h1>test</h1>
        </div>
    );
}