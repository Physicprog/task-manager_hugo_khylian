import React, { useEffect, useState } from "react";
import { deleteBoard, updateBoard } from "../services/BoardProject.js";
import { SendNotification } from "../utils/notifs.js";
import { useNavigate } from "react-router-dom";
import NewBoardSettings from "./NewBoardSettings.jsx";

const Dots = "/dots.png";

export const labelClasses = {
    red: "bg-label-red",
    blue: "bg-label-blue",
    green: "bg-label-green",
    yellow: "bg-label-yellow",
    purple: "bg-label-purple",
    orange: "bg-label-orange",
    pink: "bg-label-pink",
};

function checkIfMobile() {
    return window.innerWidth < 850;
}

function setupMobileDetection(setIsMobile) {
    function handleResize() {
        setIsMobile(checkIfMobile());
    }
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return function() {
        window.removeEventListener("resize", handleResize);
    };
}

function closeMenusAndPopups(setOpenMenuId, setShowModifyPopup, setSelectedItem) {
    setOpenMenuId(null);
    setShowModifyPopup(false);
    setSelectedItem(null);
}

function setupClickOutsideListener(openMenuId, setOpenMenuId) {
    function handleClickOutside(event) {
        if (openMenuId !== null) {
            const menuContainer = event.target.closest('.menu-container');  //on prend une marge sur les card pour cliquer dessus
            if (!menuContainer) {
                setOpenMenuId(null);

            }
        }
    }

    document.addEventListener('click', handleClickOutside);
    
    return function() {
        document.removeEventListener('click', handleClickOutside);
    };
}

export default function CardGrid({ items = [], onDelete, onBoardDeleted, onBoardModificationError, closeMenuTrigger }) {
    const [isMobile, setIsMobile] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showModifyPopup, setShowModifyPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    useEffect(function() {
        return setupMobileDetection(setIsMobile);
    }, []);

    useEffect(function() {
        if (closeMenuTrigger > 0) {
            closeMenusAndPopups(setOpenMenuId, setShowModifyPopup, setSelectedItem);
        }
    }, [closeMenuTrigger]);

    useEffect(function() {
        return setupClickOutsideListener(openMenuId, setOpenMenuId);
    }, [openMenuId]);


    function shouldNavigateToBoard() {
        return !isDeleting && !openMenuId;
    }

    function getBoardId(item) {
        return item.documentId || item.id;
    }

    function navigateToBoard(item) {
        if (shouldNavigateToBoard()) {
            const boardId = getBoardId(item);
            navigate(`/board/${boardId}`);
        }
    }

    async function deleteBoardById(boardId) {
        try {
            await deleteBoard(boardId);
            
            if (onDelete) {
                await onDelete();
            }
        } catch (err) {
            SendNotification(`Error deleting board: ${err}`, true, false);
        }
    }

    function handleDelete(item) {
        const boardId = getBoardId(item);
        deleteBoardById(boardId);
    }

    function openModifyPopup(item) {
        setSelectedItem(item);
        setShowModifyPopup(true);
    }

    function handleCloseModifyPopup() {
        setShowModifyPopup(false);
        setSelectedItem(null);
    }

    async function reloadBoardsAfterModification() {
        if (onDelete) {
            await onDelete();
        }
    }

    async function handleModifyComplete() {
        setShowModifyPopup(false);
        setSelectedItem(null);
        await reloadBoardsAfterModification();
    }

    function handleBoardNotFoundError() {
        SendNotification("Board not found", true, false);
        setShowModifyPopup(false);
        setSelectedItem(null);
        
        if (onBoardModificationError) {
            onBoardModificationError();
        }
    }

    function getCardWidth(isMobile) { 
        return isMobile ? "100%" : "calc(20% - 16px)"; 
    }

    function isMenuOpenForItem(item) {
        return openMenuId === item.id;
    }

    function canClickCard(item) {
        const isMenuOpen = isMenuOpenForItem(item);
        return !isMenuOpen && !isDeleting;
    }

    function handleCardClick(item) {
        if (canClickCard(item)) {
            navigateToBoard(item);
        }
    }

    function handleMenuClick(e, item) {
        e.stopPropagation();
        setOpenMenuId(openMenuId === item.id ? null : item.id);
    }

    function handleModifyClick(e, item) {
        e.stopPropagation();
        openModifyPopup(item);
    }

    function handleDeleteClick(e, item) {
        e.stopPropagation();
        setOpenMenuId(null);
        handleDelete(item);
    }






    return (
        <>
            <div className={`flex gap-4 ${isMobile ? "flex-col" : "flex-row flex-wrap"}`}>
                {items.length === 0 ? (
                    <div className="w-full text-center text-gray-light py-8 ">
                        No boards yet. Create your first board!
                    </div>
                ) : (
                    items.map(function(item) { //on bouble pour toutes les cards donner en parametre
                        const label = item.label ? item.label.toLowerCase() : '';
                        const isMenuOpen = isMenuOpenForItem(item);
                        const cardClasses = `relative cursor-pointer h-44 rounded-lg overflow-hidden shadow-buttonLight hover:shadow-buttonDark transition bg-white dark:bg-gray-800`;

                        return (
                            <div key={item.id} className={cardClasses} style={{ width: getCardWidth(isMobile) }} onClick={function() { handleCardClick(item); }}>
                                <div className="absolute inset-0 bg-secondary" />

                                <div className="relative z-10 h-full flex flex-col justify-between p-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <span style={{ boxShadow: `0px 5px 20px rgba(var(--label-${label}), 0.5)` }} className={`block h-[0.8vh] w-full mb-1 rounded-md ${labelClasses[label] || labelClasses.red}`} />
                                            <h3 className="font-museo text-base text-text break-words">{item.title}</h3>
                                        </div>

                                        <div className="relative menu-container ml-2">
                                            <img src={Dots} alt="more options" className="w-5 h-5 cursor-pointer hover:opacity-70 transition" onClick={function(e) { handleMenuClick(e, item); }} />






                                            {isMenuOpen && (
                                                <div className="absolute right-0 mt-2 bg-secondary border-2 border-accent1 rounded shadow-xl w-36 z-50 overflow-hidden">
                                                    <div className="h-[1px] bg-accent1/30" />
                                                    <button className="w-full text-left px-4 py-2.5 text-text hover:bg-accent1 hover:text-white transition font-medium" onClick={function(e) { handleModifyClick(e, item); }}>
                                                        Modify
                                                    </button>
                                                    <div className="h-[1px] bg-accent1/30" />
                                                    <button className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-500 hover:text-white transition font-medium disabled:opacity-50" onClick={function(e) { handleDeleteClick(e, item); }}>
                                                        {isDeleting ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}




                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-light mt-2 line-clamp-2">
                                        {item.description || "No description"}
                                    </p>
                                    <div className="text-xs text-gray-light mt-1">
                                        End: {item.endDate ? new Date(item.endDate).toLocaleDateString() : "No end date"}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showModifyPopup && selectedItem && (
                <NewBoardSettings onClose={handleCloseModifyPopup} onOpen={handleModifyComplete}
                    onBoardNotFound={handleBoardNotFoundError} editMode={true} 
                    boardToEdit={{...selectedItem, id: selectedItem.documentId || selectedItem.id }} //on s'assure d'avoir l'id dans boardToEdit, que ce soit documentId ou id selon la source des données
                />
            )}
        </>
    );
}