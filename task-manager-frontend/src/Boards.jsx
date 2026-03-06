import React from "react";
import { useNavigate } from "react-router-dom";
import BoardDetailled from "./components/boardDetailled.jsx";


export default function Boards() {
    const navigate = useNavigate();

    function goToBoardExample() {
        navigate("/board/example");
    }

    function goToTemplateBoard() {
        navigate("/template-board");
    }

    return (
        <>
            <div onClick={goToBoardExample}>
                <BoardDetailled />
            </div>

            <div onClick={goToTemplateBoard}>
                <BoardDetailled />
            </div>
        </>
    );
}


