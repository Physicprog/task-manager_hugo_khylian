import React from "react";
import { useNavigate } from "react-router-dom";
import BoardDetailled from "./components/boardDetailled.jsx";

function Boards() {
    const navigate = useNavigate();

    const switchBoardDetailled = () => {
        navigate("/board/example");
    };

    const switchBoardTemplate = () => {
        navigate("/template-board");
    };

    return (
        <>
            <div onClick={switchBoardDetailled}>
                <BoardDetailled />
            </div>

            <div onClick={switchBoardTemplate}>
                <BoardDetailled />
            </div>
        </>
    );
}

export default Boards;
