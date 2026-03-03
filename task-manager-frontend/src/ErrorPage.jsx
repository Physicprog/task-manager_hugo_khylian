import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import { getUserInfos, initializeUserData } from "./services/authService.js";
import { removeElements } from "./services/storage.js";

function ErrorPage({ errorType = "404" }) {
    const navigate = useNavigate();
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

    function LogoutClick() {
        removeElements({ token: 0, userInfo: 0, userGender: 0 });
        setUser(null);
        setUserInfos(getUserInfos(null));
        navigate('/');
    }


    function GoHomeClick() {
        navigate('/');
    }

    function getErrorContent(errorType) {
        switch (errorType) {
            case "404":
                return {
                    title:"4",
                    title2:"0",
                    title3:"4",
                    message: "Page not found",
                    description: "The page you are looking for does not exist or has been deleted."
                };
            case "500":
                return {
                    title:"5",
                    title2:"0",
                    title3:"0",
                    message: "Internal server error",
                    description: "Something went wrong on our end. Please try again later."
                };
            case "403":
                return {
                    title: "4",
                    title2:"0",
                    title3:"3",
                    message: "Access forbidden", 
                    description: "You don't have permission to access this resource."
                };
            case "401":
                return {
                    title: "4",
                    title2:"0",
                    title3:"1",
                    message: "Unauthorized",
                    description: "Please log in to access this content."
                };
            default:
                return {
                    title: "Er",
                    title2: "ro",
                    title3: "r",
                    message: "An error occurred",
                    description: "Something unexpected happened. Please try again."
                };
        }
    }

    const errorContent = getErrorContent(errorType);

    return (
        <>
            <Navbar userInfos={userInfos} onLogout={LogoutClick} onLoginClick={GoHomeClick} wantToAddSearch={false} isTemplateMode={true} onGoHome={GoHomeClick} />
            <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
                <div className="text-center p-8">
                    <div className="flex flex-row justify-center">
                        <h1 className="text-6xl font-bold text-primary mb-4 animate-waviy delay-0">{errorContent.title}</h1>
                        <h1 className="text-6xl font-bold text-primary mb-4 animate-waviy delay-1">{errorContent.title2}</h1>
                        <h1 className="text-6xl font-bold text-primary mb-4 animate-waviy delay-2">{errorContent.title3}</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-text mb-4">{errorContent.message}</h2>
                    <p className="text-gray-400 mb-8 max-w-md">{errorContent.description}</p>
                    <button  onClick={GoHomeClick} className="px-6 py-3 bg-primary text-text rounded-lg">
                        Go back to home
                    </button>
                </div>
            </div>
            <Footer WantToAddLink={false} />
        </>
    );
}

export default ErrorPage;
