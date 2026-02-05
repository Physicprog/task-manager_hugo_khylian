import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
const Sun = '/sun.png';
const Moon = '/moon.png';
const burger = '/burger.png';
const logo = '/logo.png';

export default function Navbar({ userInfos, onLogout, onLoginClick, setView, currentView, onSearch, searchQuery,
    wantToAddSearch = true, isTemplateMode = false, onGoHome }) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const themeIcon = theme === 'light' ? Sun : Moon;

    useEffect(() => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        function SwipResize() {
            setIsMobile(window.innerWidth < 850);
            if (window.innerWidth >= 850) setOpen(false);
        }

        window.addEventListener('resize', SwipResize);
        return () => window.removeEventListener('resize', SwipResize);
    }, []);

    function toggleTheme() {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    function handleSearchChange(e) {
        const query = e.target.value;
        if (onSearch) {
            onSearch(query); //apelle la fonction de recherche avec la recherche en cours
        }
    }

    const handleGoHome = () => {
        setView("home");
        navigate("/");
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[999] h-[60px] bg-secondary px-3 flex items-center border-b border-white/20">
                <div className="flex items-center w-full">
                    <div className="flex items-center gap-2">
                        <button onClick={handleGoHome}>
                            <img src={logo} alt="logo" className="h-[35px] w-auto object-contain select-none hover:animate-hoverScale active:animate-activeScale transition-all duration-200" />
                        </button>
                    </div>

                    {!isMobile && !isTemplateMode && (
                        <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-2">
                                {wantToAddSearch && (
                                    <input type="search" placeholder="Search for a board..." className="w-[250px] px-4 py-2 rounded-lg bg-surface text-sm outline-none text-text" value={searchQuery || ""} onChange={handleSearchChange} />
                                )}
                                <button onClick={handleGoHome} className={`px-4 py-2 rounded-lg border-2 border-text text-sm hover:scale-105 active:scale-95 transition-all duration-200 ${currentView === "home" ? "bg-accent1 text-white" : "bg-surface text-text"}`}>Home</button>
                                <button onClick={() => setView("projects")} className={`px-4 py-2 rounded-lg border-2 border-text text-sm hover:scale-105 active:scale-95 transition-all duration-200 ${currentView === "projects" ? "bg-accent1 text-white" : "bg-surface text-text"}`}>My projects</button>
                            </div>
                        </div>
                    )}

                    {!isMobile && isTemplateMode && (
                        <div className="flex-1 flex justify-center">
                            <button onClick={handleGoHome} className="px-4 py-2 rounded-lg border-2 border-text text-sm bg-accent1 text-white hover:opacity-90 transition" > Back to Home</button>
                        </div>
                    )}

                    {!isMobile && (
                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="w-8 h-8">
                                <img src={themeIcon} alt="theme" className="w-8 h-8 object-contain" />
                            </button>

                            {!userInfos.isConnected ? (
                                <button onClick={onLoginClick} className="px-3 py-2 bg-accent1 text-white border-2 border-text rounded-lg text-sm">Login</button>
                            ) : (<> <span className="text-text text-sm">{userInfos.username}</span>
                                <img src={userInfos.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-text" />
                                <button onClick={onLogout} className="px-3 py-2 bg-red-500 text-white border-2 border-text rounded-lg text-sm">Logout</button>
                            </>
                            )}
                        </div>
                    )}

                    {isMobile && (
                        <button onClick={() => setOpen(!open)} className="ml-auto w-10 h-10 flex items-center justify-center">
                            <img src={burger} alt="menu" className="w-8 h-8 object-contain" />
                        </button>
                    )}
                </div>
            </div>

            {isMobile && open && !isTemplateMode && (
                <div className="fixed top-[60px] left-0 right-0 z-[999] bg-secondary border-t border-white/20 px-4 py-3 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        {wantToAddSearch && (
                            <input type="search" placeholder="Search for a board..." className="flex-1 px-3 py-2 rounded-lg bg-surface text-text placeholder-black::placeholder outline-none" value={searchQuery || ""} onChange={handleSearchChange} />)}
                        <button onClick={toggleTheme} className="w-10 h-10 shrink-0">
                            <img src={themeIcon} alt="theme" className="w-full h-full object-contain" />
                        </button>
                    </div>

                    <div className="flex gap-2 w-full">
                        <button onClick={onLoginClick} className="flex-1 px-3 py-2 bg-accent1 text-white border-2 border-text rounded-lg text-sm hover:scale-105 active:scale-95 transition-all duration-200">Login</button>
                        <button onClick={() => setView("projects")} className={`flex-1 px-3 py-2 rounded-lg border-2 border-text text-sm hover:scale-105 active:scale-95 transition-all duration-200 ${currentView === "projects" ? "bg-accent1 text-white" : "bg-surface text-text"}`}>My projects</button>
                        <button onClick={() => setView("home")} className={`flex-1 px-3 py-2 rounded-lg border-2 border-text text-sm hover:scale-105 active:scale-95 transition-all duration-200 ${currentView === "home" ? "bg-accent1 text-white" : "bg-surface text-text"}`}>Home</button>
                    </div>
                </div>
            )}

            {isMobile && open && isTemplateMode && (
                <div className="fixed top-[60px] left-0 right-0 z-[999] bg-secondary border-t border-white/20 px-4 py-3 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="w-10 h-10 shrink-0">
                            <img src={themeIcon} alt="theme" className="w-full h-full object-contain" />
                        </button>
                    </div>

                    <button onClick={handleGoHome} className="w-full px-3 py-2 bg-accent1 text-white border-2 border-text rounded-lg text-sm" >
                        Back to Home </button>
                </div>
            )}
        </>
    );


}
