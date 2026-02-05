import React from "react";
import { useNavigate } from "react-router-dom";
import DetailledBoards from "./components/boardsDetailled.jsx";
import TemplateBoard from "./components/boardTemplate.jsx";

function Boards() {
    const navigate = useNavigate();

    const switchBoardDetailled = () => {
        navigate("/detailled-board");
    };

    const switchBoardTemplate = () => {
        navigate("/template-board");
    };

    return (
        <>
            <div onClick={switchBoardDetailled}>
                <DetailledBoards />
            </div>

            <div onClick={switchBoardTemplate}>
                <TemplateBoard />
            </div>
        </>
    );
}

export default Boards;
