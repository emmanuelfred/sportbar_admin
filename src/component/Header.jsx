import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoIosClose, IoIosPerson, IoIosChatbubbles, IoIosHome, IoIosLogOut, IoIosReturnLeft } from "react-icons/io";
import { Modal, Button, ListGroup } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [logName, setLogName] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    getUserLogName();
  }, []);

  const getUserLogName = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setLogName(user.logName);
      }
    } catch (error) {
      console.error("Error fetching logName:", error);
    }
  };

  return (
    <>
      {/* Header Container */}
      <div style={styles.header}>
        <img src={require("../assets/logo.png")} style={styles.logo} alt="Logo" />
        <button onClick={() => setMenuVisible(true)} style={styles.menuButton}>
          <IoIosMenu size={30} color="#fff" />
        </button>
      </div>

      {/* Notifications Modal */}
      <Modal show={isNotifVisible} onHide={() => setNotifVisible(false)} animation="slide" centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {notifications.map((item) => (
              <ListGroup.Item key={item.sale_token} onClick={() => {
                setNotifVisible(false);
                navigate(`/seeOrderScreen/${item.sale_token}`);
              }}>
                {item.message}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setNotifVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sidebar Menu */}
      <Modal show={isMenuVisible} onHide={() => setMenuVisible(false)} animation="slide" centered>
        <Modal.Body style={styles.menuOverlay}>
          <button onClick={() => setMenuVisible(false)} style={styles.menuCloseButton}>
            <IoIosClose size={30} color="black" />
          </button>
          <ListGroup>
            <ListGroup.Item action onClick={() => navigate("/ProfileScreen")}>
              <IoIosPerson size={25} /> Profile
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/TableScreen")}>
              <IoIosChatbubbles size={25} /> Active Table
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/Dashboard")}>
              <IoIosHome size={25} /> Home
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/returnTable")}>
              <IoIosReturnLeft size={25} /> Return Item
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/ServedTable")}>
              <IoIosReturnLeft size={25} /> Served Table
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate("/LogoutScreen")}>
              <IoIosLogOut size={25} /> Logout
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#2a5298",
    height:'50px'
    
  },
  logo: {
    width: "120px",
    height: "40px",
    objectFit: "contain",
  },
  menuButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    width:'fit-content',
    margin:0,
  },
  menuOverlay: {
    padding: "20px",
    width: "250px",
    backgroundColor: "#fff",
    height: "100%",
  },
  menuCloseButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};
