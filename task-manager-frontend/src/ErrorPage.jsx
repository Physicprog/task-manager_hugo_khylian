import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import { getUserInfos, initializeUserData } from "./services/authService.js";
import { removeElements } from "./services/storage.js";

function ErrorPage() {
    const navigate = useNavigate();
    const { errorType } = useParams();
    const [user, setUser] = useState(null);
    const [userInfos, setUserInfos] = useState(getUserInfos(null));

    useEffect(function() {
        const token = localStorage.getItem("token");
        if (token) {
            loadUserData();
        }
    }, []);

    async function loadUserData() {
        try {
            const userData = await initializeUserData();
            setUser(userData);
            setUserInfos(getUserInfos(userData));
        } catch (error) {
            removeElements({ token: 0, userInfo: 0, userGender: 0 });
        }
    }

    function handleLogoutClick() {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
        setUser(null);
        setUserInfos(getUserInfos(null));
        navigate('/');
    }

    function handleGoHomeClick() {
        navigate('/');
    }

    function getErrorContent() {
        switch (errorType) {
            case "404":
                return {
                    title: "404",
                    message: "Board not found",
                    description: "The board you are looking for does not exist or has been deleted."
                };
            case "500":
                return {
                    title: "500", 
                    message: "Internal server error",
                    description: "Something went wrong on our end. Please try again later."
                };
            case "403":
                return {
                    title: "403",
                    message: "Access forbidden", 
                    description: "You don't have permission to access this board."
                };
            case "401":
                return {
                    title: "401",
                    message: "Unauthorized",
                    description: "Please log in to access this board."
                };
            default:
                return {
                    title: "Error",
                    message: "An error occurred",
                    description: "Something unexpected happened. Please try again."
                };
        }
    }

    const errorContent = getErrorContent();

    return (
        <>
            <Navbar userInfos={userInfos} onLogout={handleLogoutClick} onLoginClick={handleLoginClick} wantToAddSearch={false} isTemplateMode={true} onGoHome={handleGoHomeClick} />
            <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
                <div className="text-center p-8">
                    <h1 className="text-6xl font-bold text-primary mb-4">{errorContent.title}</h1>
                    <h2 className="text-2xl font-semibold text-text mb-4">{errorContent.message}</h2>
                    <p className="text-gray-400 mb-8 max-w-md">{errorContent.description}</p>
                    <button  onClick={handleGoHomeClick} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                        Go Back Home
                    </button>
                </div>
            </div>
            <Footer WantToAddLink={false} />
        </>
    );
}

export default ErrorPage;
