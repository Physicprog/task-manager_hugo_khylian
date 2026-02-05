import { useState, useEffect } from "react";
import { CreateNewRawBoard, updateBoard } from "../services/boardProject.js";
import { SendNotification } from "../utils/notifs.js";
const Close = "/Close.png";
const Dots = "/dots.png";

export default function NewBoardSettings({ onClose, onOpen, editMode = false, boardToEdit = null }) {
    const [formData, setFormData] = useState({ title: "", description: "", label: "Red", endDate: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (editMode && boardToEdit) {
            setFormData({
                title: boardToEdit.title || "",
                description: boardToEdit.description || "",
                label: boardToEdit.label || "Red",
                endDate: boardToEdit.endDate || ""
            });
        }
    }, [editMode, boardToEdit]);


    function updateField(field, value) {
        var newData = {};
        for (var key in formData) {
            newData[key] = formData[key];
        }
        newData[field] = value;
        setFormData(newData); //met avec jours le state avec les nouvelles valeurs 
    }

    function SwipClose() {
        setClosing(true);
        setTimeout(onClose, 300);
    }

    function validateForm() {
        if (!formData.title) {
            SendNotification("Title missing");
            return false;
        }
        return true;
    }

    async function SwipSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            if (editMode && boardToEdit) {
                const boardId = boardToEdit.documentId || boardToEdit.id;
                await updateBoard(boardId, formData);
                SendNotification("Board updated successfully!", true, true);
                if (onOpen) {
                    onOpen(); //rafraichie la liste des boards
                }
            } else {
                const result = await CreateNewRawBoard({ title: formData.title, description: formData.description, label: formData.label, endDate: formData.endDate });
                SendNotification("Board created successfully!", true, true);
                if (onOpen && result && result.data) {
                    onOpen(result.data);
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsLoading(false);
            SwipClose();
        }
    }

    return (
        <div className={`fixed inset-0 flex m-t-50px items-center justify-center z-50 ${closing ? "animate-scaleOUT" : "animate-scaleIN"}`} >
            <div className="bg-grayLight p-4 rounded-lg w-[420px] relative border-2 border-accent1 shadow-lg">
                <button onClick={SwipClose} className="absolute top-3 right-3 text-white">
                    <img src={Close} alt="Close" className={`w-6 h-6`} />
                </button>
                <h1 className="text-text text-xl mb-2 flex justify-center">
                    {editMode ? "Modify board" : "New board settings"}
                </h1>

                <div className="h-[0.5vh] w-[100%] bg-accent1 rounded-[0.55vh] mt-[-8px] mb-2 shadow-[0_0_15px_#6f00ff57]"></div>
                <form onSubmit={SwipSubmit} className="flex flex-col gap-3">
                    <input type="text" placeholder="Card title" value={formData.title} onChange={e => updateField("title", e.target.value)} className="p-2 rounded text-black" disabled={isLoading} />
                    <input type="text" placeholder="Card description" value={formData.description} onChange={e => updateField("description", e.target.value)} className="p-2 rounded text-black" disabled={isLoading} />
                    <select value={formData.label} onChange={e => updateField("label", e.target.value)} className="p-2 rounded text-black">
                        <option value="Red" className="bg-red-500">Red</option>
                        <option value="Blue" className="bg-blue-500">Blue</option>
                        <option value="Green" className="bg-green-500">Green</option>
                        <option value="Yellow" className="bg-yellow-500">Yellow</option>
                        <option value="Purple" className="bg-purple-500">Purple</option>
                        <option value="Orange" className="bg-orange-500">Orange</option>
                        <option value="Pink" className="bg-pink-500">Pink</option>
                    </select>

                    <input type="date" value={formData.endDate || ""} placeholder="End Date" onChange={e => updateField("endDate", e.target.value)} className="p-2 rounded border-black text-black" />
                    <button type="submit" disabled={isLoading} className="bg-accent1 text-white py-1.5 rounded">
                        {isLoading ? "Loading..." : (editMode ? "Update board" : "Create board")}
                    </button>
                </form>
            </div>
        </div>
    );

}

