import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // CSS file we'll create next
import logo from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    logoRef.current.classList.add("fade-in");
    buttonRef.current.classList.add("slide-up");
  }, []);

  return (
    <div className="home-container">
      <div ref={logoRef} className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1 style={{color:"#fff"}}>Welcome to Sport Bar</h1>

      <div  ref={buttonRef}className="btn-container">
        

        <button className="btn" onClick={() => navigate("/salelogin")}>
          Sale Attendant
        </button>
      </div>
    </div>
  );
};

export default Home;
