import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardDetails } from "../services/boardDetailled.js";
import SecondaryNavbar from "./BoardComponant/SecondaryNavbar.jsx";
import Navbar from "./navbar.jsx";
import Login from "./login.jsx";
import { getUserInfos, initializeUserData } from "../services/authService.js";
import { removeElements } from "../services/storage.js";
import { SendNotification } from "../utils/notifs.js";

export default function DetailledBoards({ isTemplate = false }) {
    const navigate = useNavigate();
    const [boardName, setBoardName] = useState("Loading...");
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [userInfos, setUserInfos] = useState(getUserInfos(null));
    const boardId = useParams().boardId;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            async function init() {
                try {
                    const userData = await initializeUserData();
                    setUser(userData);
                    setUserInfos(getUserInfos(userData));
                } catch (error) {
                    removeElements({ token: 0, userInfo: 0, userGender: 0 });
                }
            }
            init();
        }
    }, []);

    useEffect(() => {
        async function loadBoardName() {
            if (boardId && !isTemplate) {
                const name = await getBoardDetails(boardId, "boardName");
                setBoardName(name || "Unknown Board");
            }
        }
        loadBoardName();
    }, [boardId, isTemplate]);

    const handleGoHome = () => {
        navigate('/');
    };

    async function handleLogin(data) {
        if (data?.user) {
            setUser(data.user);
            setUserInfos(getUserInfos(data.user));
        } else {
            SendNotification("Login failed: No user data received", true, false);
        }
        setShowLogin(false);
    }

    function handleLogout() {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
        setUser(null);
        setUserInfos(getUserInfos(null));
        SendNotification("Logged out successfully", true, true);
    }




    //on refait mais sans if que avec des ?
    return (
        <>
            <Navbar userInfos={userInfos} onLogout={handleLogout} onLoginClick={() => setShowLogin(true)} wantToAddSearch={false} isTemplateMode={isTemplate} onGoHome={handleGoHome} />

            <SecondaryNavbar boardName={isTemplate ? "Template Board" : boardName} />

            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-text text-4xl font-museo mb-4">
                        {isTemplate ? "TEMPLATE BOARD" : `BOARD DETAILED ${boardId}`}
                    </h1>
                </div>
            </div>

            <div>

            </div>



            {showLogin && (
                <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
            )}
        </>
    );
}


{/*</div>
                if (isTemplate) {
        return (
                <>
                    <Navbar
                        userInfos={userInfos}
                        onLogout={handleLogout}
                        onLoginClick={() => setShowLogin(true)}
                        wantToAddSearch={false}
                        isTemplateMode={isTemplate}
                        onGoHome={handleGoHome}
                    />
                    <SecondaryNavbar isTemplateMode={true} />
                    <div className="min-h-screen bg-surface flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-text text-6xl font-bold font-museo mb-8">
                                TEMPLATE BOARD
                            </h1>
                            <button
                                onClick={handleGoHome}
                                className="px-8 py-3 bg-accent1 hover:bg-accentLight text-white rounded-lg font-semibold text-lg transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>

                    {showLogin && (
                        <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
                    )}
                </>
                );
    } else {
        return (
                <>
                    <Navbar
                        userInfos={userInfos}
                        onLogout={handleLogout}
                        onLoginClick={() => setShowLogin(true)}
                        wantToAddSearch={false}
                        isTemplateMode={true}
                        onGoHome={handleGoHome}
                    />
                    <SecondaryNavbar boardName={boardName} />
                    <div className="min-h-screen bg-surface flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-text text-4xl font-museo mb-4">
                                BOARD DETAILED {boardId}
                            </h1>

                            <h3 className="text-text text-4xl font-museo mb-4">
                                Board Name: {boardName}
                            </h3>

                            <button
                                onClick={handleGoHome}
                                className="px-6 py-2 bg-accent1 hover:bg-accentLight text-white rounded-lg transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                    */}





