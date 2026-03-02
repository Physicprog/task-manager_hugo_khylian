import { useState, useEffect } from "react";
import { CreateNewRawBoard, updateBoard } from "../services/BoardProject.js";
import { SendNotification } from "../utils/notifs.js";
const Close = "/Close.png";

export default function NewBoardSettings({ onClose, onOpen, onBoardNotFound, editMode = false, boardToEdit = null }) {
    const [formData, setFormData] = useState({ title: "", description: "", label: "Red", endDate: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (editMode && boardToEdit) {
            const newFormData = {
                title: boardToEdit.title,
                description: boardToEdit.description || "",
                label: boardToEdit.label || "Red",
                endDate: boardToEdit.endDate || ""
            };
            setFormData(newFormData);
        }
    }, [editMode, boardToEdit]);

    function updateField(field, value) {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    }

    function SwipClose() {
        if (isLoading) return;
        setClosing(true);
        setTimeout(onClose, 300);
    }

    function validateForm() {
        if (!formData.title || formData.title.trim() === "") {
            SendNotification("Title is required", true, false);
            return false;
        }

        if (formData.title.length > 20) {
            SendNotification("Title is too long (max 20 characters)", true, false);
            return false;
        }

        if (formData.description && formData.description.length > 100) {
            SendNotification("Description is too long (max 100 characters)", true, false);
            return false;
        }

        return true;
    }

    async function SwipSubmit(e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        if (editMode && boardToEdit) {
            await updateBoard(boardToEdit.id, formData);
        } else {
            await CreateNewRawBoard(formData);
        }
        if (onOpen) {
            await onOpen();
        }
        SwipClose();
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]`} onClick={SwipClose}>
            <div className={`${closing ? "animate-scaleOUT" : "animate-scaleIN"} bg-grayLight p-4 rounded-lg w-[420px] max-w-[90%] relative border-2 border-accent1 shadow-lg`} onClick={(e) => e.stopPropagation()}>
                <button onClick={SwipClose} className="absolute top-3 right-3 text-white hover:opacity-70 transition disabled:opacity-50" disabled={isLoading}>
                    <img src={Close} alt="Close" className="w-6 h-6" />
                </button>

                <h1 className="text-text text-xl mb-2 flex justify-center font-museo">
                    {editMode ? "Modify board" : "New board settings"}
                </h1>

                <div className="h-[0.5vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-8px] mb-4 shadow-[0_0_15px_#6f00ff57]"></div>

                <form onSubmit={SwipSubmit} className="flex flex-col gap-3">
                    <input type="text" placeholder="Board title*" value={formData.title} onChange={e => updateField("title", e.target.value)} className="p-2 rounded text-black border-2 border-gray-300 focus:border-accent1 outline-none transition" disabled={isLoading} maxLength={100} required />

                    <textarea placeholder="Board description" value={formData.description} onChange={e => updateField("description", e.target.value)} className="p-2 rounded text-black border-2 border-gray-300 focus:border-accent1 outline-none transition resize-none" disabled={isLoading} maxLength={500} rows={3} />

                    <select value={formData.label} onChange={e => updateField("label", e.target.value)} className="p-2 rounded text-black border-2 border-gray-300 focus:border-accent1 outline-none transition" disabled={isLoading}>
                        <option value="Red" className="bg-red-400">Red</option>
                        <option value="Blue" className="bg-blue-400">Blue</option>
                        <option value="Green" className="bg-green-400">Green</option>
                        <option value="Yellow" className="bg-yellow-400">Yellow</option>
                        <option value="Purple" className="bg-purple-400">Purple</option>
                        <option value="Orange" className="bg-orange-400">Orange</option>
                        <option value="Pink" className="bg-pink-400">Pink</option>
                    </select>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="endDate" className="text-sm text-gray-300">End Date (optional)</label>
                        <input type="date" id="endDate" value={formData.endDate || ""} onChange={e => updateField("endDate", e.target.value)} className="p-2 rounded text-black border-2 border-gray-300 focus:border-accent1 outline-none transition" 
                            disabled={isLoading} />
                    </div>

                    <button type="submit" disabled={isLoading} className="bg-accent1 text-white py-2.5 rounded font-semibold hover:bg-accentLight transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                {editMode ? "Updating..." : "Creating..."}
                            </span>
                        ) : (editMode ? "Update board" : "Create board")}
                    </button>
                </form>
            </div>
        </div>
    );
}