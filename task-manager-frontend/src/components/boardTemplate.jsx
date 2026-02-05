import React, { useEffect, useState } from 'react';
import Navbar from "./navbar.jsx";
import Login from "./login.jsx";
import { useNavigate } from "react-router-dom";
import Footer from './footer.jsx';
import SecondaryNavbar from './BoardComponant/SecondaryNavbar.jsx';


export default function TemplateBoard() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);

    const userInfos = {
        isConnected: false, // boolean à 'false', renvoie 'non' pour le check afin de se connecter dans la navbar
        username: "",
        avatar: ""
    };

    function goHome() {
        navigate("/");
    }

    function handleLogin() {
        setShowLogin(true);
    }

    function handleLoginSuccess(data) {
        setShowLogin(false);
        {/*navigate("/");*/ }
    }

    return (
        <>
            <Navbar userInfos={userInfos} onLoginClick={handleLogin}
                onLogout={() => { }} setView={() => { }} currentView="template" onSearch={() => { }}
                searchQuery="" isTemplateMode={true} onGoHome={goHome} />


            <header className="min-h-screen bg-surface flex items-center justify-center pt-[60px]">
                <SecondaryNavbar isTemplateMode={true} />
            </header>

            <main className="">
                <div className="">

                </div>
            </main>


            {showLogin && (<Login onLogin={handleLoginSuccess} onClose={() => setShowLogin(false)} />)}
            <Footer WantToAddLink={false} />
        </>
    );
}