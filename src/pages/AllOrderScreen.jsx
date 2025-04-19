import React, { useState, useEffect } from "react";
import { useNavigate, useLocation,useSearchParams } from "react-router-dom";
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import Header from "../component/Header"; // Assuming Header is a component
import CustomAlertModal from "../component/CustomAlertModal"; // Assuming CustomAlertModal is a component

import '../styles/AllOrderScreen.css'
import '../styles/cart.css'
 
const AllOrderScreen = () => {
  const [cart, setCart] = useState([]);
  const [modalData, setModalData] = useState({ visible: false, title: '', message: '', buttons: [] });
  const [customerName, setCustomerName] = useState("");
  const [logName, setLogName] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [searchParams] = useSearchParams();

  const staff_id = searchParams.get("staff_id");
  const log_name = searchParams.get("log_name");
  const table_number = searchParams.get("table_number");
  const ordersString = searchParams.get("orders");
  const orders = ordersString ? JSON.parse(decodeURIComponent(ordersString)) : [];

  useEffect(() => {
    loadCart();
    checkUserLogin();
  }, []);

  const checkUserLogin = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLogName(parsedUser.logName);
      setCustomerName(parsedUser.name);
    }
  };

  const loadCart = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      const updatedCart = cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    navigate(user ? "/Dashboard" : "/Customer");
  };

  const handleCheckout = async () => {
    if (!staff_id || !table_number || !log_name || cart.length === 0) {
      alert("Please fill in all details and add items to the cart.");
      return;
    }

    const orderData = {
      attendant: user ? user.name : "Customer",
      staff_id,
      log_name,
      table_number,
      sale_token: Math.random().toString(36).substring(2, 10),
    };

    try {
      const response = await fetch("https://thesportsbar.com.ng/sport/checkout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert("Your order has been placed successfully!");
        clearCart();
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to connect to the server.");
    }
  };
  const handleBack = async ()=>{
    if(!user){
      navigate("/Customer");
    }else{
      navigate("/Dashboard");
    }
  
  }
  return (
    <>
    {/* Show Header only if user is logged in (Sales Attendant) */}
    {user && <Header />}

    <div className="container">
      <h1 className="title">Checkout</h1>

      {cart.length === 0 ? (
        <div>
          <p className="empty-cart-text">Your cart is empty.</p>
          <button className="order-button" onClick={handleBack}>
            <span className="order-button-text">Back</span>
          </button>
        </div>
      ) : (
       cart.map((item) => (
                   <div className="cart-item" key={item.id + Math.random()}>
                     <span className="item-title">{item.title}</span>
       
                     <div className="quantity-container">
                       <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                         <FaMinusCircle color="red" />
                       </button>
       
                       <input
                         type="number"
                         className="quantity-input"
                         value={item.quantity}
                         onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                       />
       
                       <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                         <FaPlusCircle color="green" />
                       </button>
                     </div>
       
                     <span className="item-price">₦{item.price * item.quantity}</span>
                   </div>
                 ))
      )}

      {cart.length > 0 && (
        <div className="footer">
          <p className="total-text">Total: ₦{calculateTotal()}</p>
          <button className="order-button" onClick={handleCheckout} style={{marginTop:0}}>
            <span className="order-button-text">Checkout Table</span>
          </button>
          <button className="order-button" onClick={clearCart} style={{marginTop:0}}>
            <span className="order-button-text">Back</span>
          </button>
        </div>
      )}
    </div>

    <CustomAlertModal
      visible={modalData.visible}
      title={modalData.title}
      message={modalData.message}
      buttons={modalData.buttons}
      onClose={() => setModalData((prev) => ({ ...prev, visible: false }))}
    />
  </>
  );
};

export default AllOrderScreen;
