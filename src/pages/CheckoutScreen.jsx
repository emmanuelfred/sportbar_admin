import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import Header from "../component/Header"; // Assuming Header is a component
import CustomAlertModal from "../component/CustomAlertModal"; // Assuming CustomAlertModal is a component
import "../styles/CheckoutScreen.css"; 
import "../styles/cart.css"; 
const CheckoutScreen = () => {
  const [showActionOptions, setShowActionOptions] = useState(false);
  const [cart, setCart] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [logName, setLogName] = useState("");
  const [user, setUser] = useState(null);
  
  const [modalData, setModalData] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });
  const navigate = useNavigate();

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
    if (storedCart !== null) {
      setCart(JSON.parse(storedCart));
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    setModalVisible(true);
  };

  const confirmOrder = async () => {
    if (!customerName || !tableNumber || !logName) {
      
      setModalData({
        visible: true,
        title: "Error",
        message: "Please fill in all details before proceeding.",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalData((prev) => ({ ...prev, visible: false })),
          },
        ],
      });
      return;
    }

    const orderData = {
      attendant: user ? user.staff_id : "Customer",
      customer_name: user ? user.name : customerName,
      table_number: tableNumber,
      log_name: user ? user.logName : logName,
      sale_date: new Date().toISOString().split("T")[0],
      sale_token: Math.random().toString(36).substring(2, 10),
      cart: cart,
    };
    

    if (orderData.attendant == "Customer") {
     
      try {
        const response = await fetch("https://thesportsbar.com.ng/sport/save_order.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (result.success) {
          setModalData({
            visible: true,
            title: "Order Confirmed",
            message: "Your order has been placed successfully!",
            buttons: [
              {
                text: "OK",
                onPress: async () => {
                  await clearCart();
                  setModalData((prev) => ({ ...prev, visible: false }));
                },
              },
            ],
          });
        } else {
          setModalData({
            visible: true,
            title: "Error",
            message: result.message || "Something went wrong.",
            buttons: [
              {
                text: "OK",
                onPress: () => setModalData((prev) => ({ ...prev, visible: false })),
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error placing order:", error);
        setModalData({
          visible: true,
          title: "Error",
          message: "Failed to connect to the server.",
          buttons: [
            {
              text: "OK",
              onPress: () => setModalData((prev) => ({ ...prev, visible: false })),
            },
          ],
        });
      }
    } else {
      setShowActionOptions(true);
    }
  };

  const clearCart = async () => {
    try {
      localStorage.removeItem("cart");
      setCart([]);
      if (!user) {
        navigate("/Customer");
      } else {
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  const addordertable = async () => {
    if (!user || !user.staff_id || !tableNumber) {
      setModalData({
        visible: true,
        title: "Error",
        message: "User and table number are required.",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalData(prev => ({ ...prev, visible: false })),
          },
        ],
      });
      return;
    }
  
    const requestData = {
      saleid: user.staff_id,
      table: tableNumber,
      attendant: user?.name || "Customer",
      staff_id: user?.staff_id || "Customer",
      log_name: user?.logName || logName,
      table_number: tableNumber,
      sale_date: new Date().toISOString().split("T")[0],
      sale_token: Math.random().toString(36).substring(2, 10),
  
      cart: cart.map((item, index) => ({
        item_id: index + 1,
        item_name: item.title,
        item_price: item.price,
        item_portion: item.quantity,
        item_catergory: item.category,
      })),
    };
  
    try {
      const response = await fetch("https://thesportsbar.com.ng/sport/addordertable.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const result = await response.json();
  
      if (result.error) {
        setModalData({
          visible: true,
          title: "Verification Failed",
          message: result.error,
          buttons: [
            {
              text: "OK",
              onPress: () => setModalData(prev => ({ ...prev, visible: false })),
            },
          ],
        });
      } else if (result.array && result.array.length > 0) {
        setModalData({
          visible: true,
          title: "Success",
          message: "Table verified successfully. Updating cart...",
          buttons: [
            {
              text: "OK",
              onPress: () => {
                setModalData(prev => ({ ...prev, visible: false }));
                updateCart(result.array);
              },
            },
          ],
        });
      } else {
        setModalData({
          visible: true,
          title: "Info",
          message: result.message || "No sales records found for this table.",
          buttons: [
            {
              text: "OK",
              onPress: () => setModalData(prev => ({ ...prev, visible: false })),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error verifying table:", error);
      setModalData({
        visible: true,
        title: "Error",
        message: "Failed to connect to the server.",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalData(prev => ({ ...prev, visible: false })),
          },
        ],
      });
    }
  };
  
  
  const updateCart = async (orders) => {
    if (!orders || orders.length === 0) {
      setModalData({
        visible: true,
        title: "No Orders",
        message: "No previous orders found for this table.",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalData(prev => ({ ...prev, visible: false })),
          },
        ],
      });
      return;
    }
  
    try {
      // Extract Staff_id, sale_token, and table_num from the first order
      const { Staff_id, sale_token, table_num } = orders[0];
  
      // Map orders to the desired cart structure
      const updatedCart = orders.map((item) => ({
        id: item.id,
        title: item.item_name, // Save item_name as title
        price: item.item_price, // Save item_price as price
        quantity: item.item_portion || 1, // Save item_portion as quantity (default to 1 if missing)
        catergory: item.item_catergory,
      }));
  
      // Log the updated cart to check if the structure is correct
  
  
      // Save the updated cart to AsyncStorage
      
      localStorage.setItem("cart", JSON.stringify(updatedCart));
  
  
      // Update state
      setCart(updatedCart);
      console.log({
        staff_id: user ? user.staff_id : "Customer",  // Default to 'Customer' if user is not defined
        log_name: user ? user.logName : logName || "Guest",  // Use 'Guest' if logName is undefined
        table_number: tableNumber || "Unknown",  // Default to 'Unknown' if tableNumber is not provided
        orders: encodeURIComponent(JSON.stringify(updatedCart)), // Ensure updatedCart is valid
      })
  
      const query = new URLSearchParams({
        staff_id: user?.staff_id || "Customer",
        log_name: user?.logName || logName || "Guest",
        table_number: tableNumber || "Unknown",
        orders: encodeURIComponent(JSON.stringify(updatedCart)),
      }).toString();
    
      navigate(`/AllOrderScreen?${query}`);
      
    } catch (error) {
      console.error("Error updating cart in storage:", error);
    }
  };
  
  
  
  const newTable = async () => {
    try {
      if (!customerName || !tableNumber || !logName || cart.length === 0) {
        setModalData({
          visible: true,
          title: "Error",
          message: "Please fill in all details and add items to the cart.",
          buttons: [
            {
              text: "OK",
              onPress: () => setModalData(prev => ({ ...prev, visible: false })),
            },
          ],
        });
        return;
      }
  
      const orderData = {
        attendant: user ? user.name : "Customer",
        staff_id: user ? user.staff_id : "Customer",
        log_name: user ? user.logName : logName,
        table_number: tableNumber,
        sale_date: new Date().toISOString().split("T")[0],
        sale_token: Math.random().toString(36).substring(2, 10),
        cart: cart.map((item, index) => ({
          item_id: index + 1,
          item_name: item.title,
          item_price: item.price,
          item_portion: item.quantity,
          item_catergory: item.category,
        })),
      };
  
      const response = await fetch("https://thesportsbar.com.ng/sport/newtable.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      const result = await response.json();
  
      if (result.error) {
        setModalData({
          visible: true,
          title: "Error",
          message: result.error,
          buttons: [
            {
              text: "OK",
              onPress: () => setModalData(prev => ({ ...prev, visible: false })),
            },
          ],
        });
      } else {
        setModalData({
          visible: true,
          title: "Success",
          message: "Order placed successfully!",
          buttons: [
            {
              text: "OK",
              onPress: async () => {
                await clearCart();
                setModalData(prev => ({ ...prev, visible: false }));
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error sending order:", error);
      setModalData({
        visible: true,
        title: "Error",
        message: "Failed to send order.",
        buttons: [
          {
            text: "OK",
            onPress: () => setModalData(prev => ({ ...prev, visible: false })),
          },
        ],
      });
    }
  };
  const handleback = async ()=>{
    if(!user){
      navigate("/Customer");
    }else{
      navigate("/Dashboard");
    }
  
  }


  return (
    <div className="container">
    <Header />
    <div>
    <div className="cart-wrapper">
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p className="empty-cart-text">Your cart is empty.</p>
          <button className="back-button" onClick={clearCart}>Back</button>
        </div>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
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
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-footer">
          <p className="totalText">Total: {calculateTotal()}</p>
      <Button className="orderButton" onClick={handlePlaceOrder} style={{marginTop:0}}>
        Place Order
      </Button>
        </div>
      )}
    </div>

      

      {/* Modal for Confirming Order */}
      <Modal show={isModalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center">
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input"
              placeholder="Enter Customer Name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Table Number</Form.Label>
            <Form.Control
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="input"
              placeholder="Enter Table Number"
            />
            
            
          </Form.Group>
          <Form.Group>
            <Form.Label>Log Area</Form.Label>
            <Form.Control
              type="text"
              value={logName}
              onChange={(e) => setLogName(e.target.value)}
              className="input"
              placeholder="Enter Table Number"
            />
            
            
          </Form.Group>
         
          <Button
            variant="primary"
            onClick={confirmOrder}
            className="confirmButton"
          >
            Confirm Order
          </Button>
        </Modal.Body>
      </Modal>

      <CustomAlertModal
        visible={showActionOptions}
        onClose={() => setShowActionOptions(false)}
        title="Action"
        message="What would you like to do?"
        buttons={[
          { text: "Add to existing table", onPress: addordertable },
          { text: "Create new table", onPress: newTable },
          { text: "Cancel", style: "cancel", onPress: () => setShowActionOptions(false) }
        ]}
      />

      {/* Custom Alert Modal */}
      {modalData.visible && (
         <CustomAlertModal
         visible={modalData.visible}
         title={modalData.title}
         message={modalData.message}
         buttons={modalData.buttons}
         onClose={() => setModalData(prev => ({ ...prev, visible: false }))}
       />
      )}
    </div>
  </div>
  );
};

export default CheckoutScreen;
