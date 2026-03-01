import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import BoardDetailled from "./components/boardDetailled.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {


    //on intialise AOS pour les animations et le loader par la suite
  useEffect(() => {
    AOS.init({
      easing: 'ease-in-out',
      once: true,
    });

    const loader = document.getElementById("loader");
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.transition = "opacity 1.5s ease";
        setTimeout(() => {
          loader.style.display = "none";
        }, 1500);
      }, 500);
    }
  }, []); //le [] permet d'executer une seule fois le useEffect 


  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId" element={<BoardDetailled isTemplate={false} />} />
          <Route path='/template-board' element={<BoardDetailled isTemplate={true} />} />
        </Routes>
      </Router>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
