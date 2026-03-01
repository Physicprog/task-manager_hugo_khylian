import React, { useState } from "react";
import HowToUsePanel from "./HowToUsePanel.jsx";

const fav = "/fav.png";
const nofav = "/nofav.png";

export default function SecondaryNavbar({ isTemplateMode = false, boardName, showOnlyFavorites, setShowOnlyFavorites }) {
    const [showHowToUse, setShowHowToUse] = useState(false);

    function closeHowToUse() {
        setShowHowToUse(false);
    }

    return (
        <>
            <div className="fixed top-[60px] left-0 right-0 z-[500] h-[35px] bg-navbar px-4 flex items-center border-b border-text">
                <div className="flex justify-between gap-2 items-center w-full">
                    <h1 className="text-text text-[15px] font-museo">
                        {isTemplateMode ? "Template board, this board will not be saved!" : boardName}
                    </h1>
                    <div className="flex items-center gap-4">
                        <img
                            src={showOnlyFavorites ? fav : nofav}
                            alt="favorite"
                            className="h-5 w-[1.3rem] cursor-pointer hover:opacity-70 transition"
                            onClick={() => setShowOnlyFavorites && setShowOnlyFavorites(!showOnlyFavorites)}
                        />

                        <button className="cursor-pointer mt-[0.5rem] hover:opacity-70 transition" onClick={() => setShowHowToUse(true)} aria-label="How to use">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                </div>
            </div>

            {showHowToUse && <HowToUsePanel onClose={closeHowToUse} />}
        </>
    );
}