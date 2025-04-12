import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap"; // Optional: For displaying alerts (you can use plain HTML if preferred)

const LogoutScreen = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Fetch stored user data from localStorage
        const userData = localStorage.getItem("user");
        if (!userData) {
          Alert.alert("Error", "No user data found.");
          navigate("/SaleLogin");
          return;
        }

        const user = JSON.parse(userData);

        // Send request to update login_status in the database
        const response = await fetch("https://thesportsbar.com.ng/sport/logout.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sale_person_id: user.staff_id }), // ✅ Use staff_id
        });

        const result = await response.json();

        if (result.success) {
          // Clear stored user data and cart
          localStorage.removeItem("cart");
          localStorage.removeItem("user");

          // Redirect to the login or index page
          navigate("/"); // Change this to "/index" if needed
        } else {
          Alert.alert("Error", result.message || "Failed to log out.");
          navigate("/Dashboard");
        }
      } catch (error) {
        console.error("Logout Error:", error);
        Alert.alert("Error", "Failed to connect to the server.");
        navigate("/Dashboard");
      }
    };

    handleLogout();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Logging out...</h2>
      <div className="spinner-border" role="status" style={{ color: "blue" }}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LogoutScreen;
