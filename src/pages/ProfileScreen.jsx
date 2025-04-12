import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import "../styles/ProfileScreen.css"; // Import the CSS styles

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="header">Profile</h1>

        {user ? (
          <div className="profile-info">
            <p className="label">Name:</p>
            <p className="value">{user.name}</p>

            <p className="label">Staff ID:</p>
            <p className="value">{user.staffId}</p>

            <p className="label">Log Name:</p>
            <p className="value">{user.logName}</p>
          </div>
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>
    </>
  );
};

export default ProfileScreen;
