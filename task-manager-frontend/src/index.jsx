import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import BoardDetailled from "./components/boardDetailled.jsx";
import ErrorPage from "./ErrorPage.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function initializeAnimations() {
    AOS.init({
        easing: 'ease-in-out',
        once: true,
    });
}


function hideLoader() {
    const loader = document.getElementById("loader");
    if (!loader) {
        return;
    }

    setTimeout(function() {
        loader.style.opacity = "0";
        loader.style.transition = "opacity 1.5s ease";
        
        setTimeout(function() {
            loader.style.display = "none";
        }, 1500);
    }, 500);
}

function App() {
    useEffect(function() {
        initializeAnimations();
        hideLoader();
    }, []); //ne charge qu'une fois 

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/board/:boardId" element={<BoardDetailled isTemplate={false} />} />
                    <Route path='/template-board' element={<BoardDetailled isTemplate={true} />} />
                    <Route path="*" element={<ErrorPage errorType="404" />} />
                </Routes>
            </Router>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
