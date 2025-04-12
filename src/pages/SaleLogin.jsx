import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SaleLogin.css"; // Create a CSS file for styles

const SaleLogin = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [staff_id, setStaffId] = useState("");
  const [logName, setLogName] = useState("");

  const handleLogin = async () => {
    if (!name || !staff_id || !logName) {
      alert("Please fill in all fields");
      return;
    }
    console.log('working')

    try {
      const response = await fetch("https://thesportsbar.com.ng/sport/sale_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, staff_id, log_name: logName }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Save user info in localStorage
        localStorage.setItem("user", JSON.stringify({ name, staff_id, logName }));
        alert(data.message);
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="sale-login-container">
      <h2>Sale Attendant Login</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Staff ID"
        value={staff_id}
        onChange={(e) => setStaffId(e.target.value)}
      />

      <select value={logName} onChange={(e) => setLogName(e.target.value)}>
        <option value="">Select Area</option>
        <option value="VIP">VIP</option>
        <option value="Snooker Area">Snooker Area</option>
        <option value="Field">Field</option>
      </select>

      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
};

export default SaleLogin;
