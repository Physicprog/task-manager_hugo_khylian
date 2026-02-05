import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "./Home.jsx";
import "./index.css";
import DetailledBoards from "./components/boardsDetailled.jsx";
import TemplateBoard from "./components/boardTemplate.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';


function App() {
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
  }, []);





  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detailled-board" element={<DetailledBoards />} />
          <Route path='/template-board' element={<TemplateBoard />} />
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
