import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoCartOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";
import { Modal, Button,  Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const API_URL = "https://thesportsbar.com.ng/sport/get_all_items.php"; // Replace with your server URL

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("VIP");
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key for re-rendering

  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
    loadCart(); // Load cart from localStorage
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;

      setMenuItems(data);
      setCategories([...new Set(data.map((item) => item.category))]);
      setFilteredItems(data);
    } catch (error) {
      setError("Failed to load menu. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load cart from localStorage
  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
    }
  };

  // Save cart to localStorage
  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredItems(
        menuItems.filter((item) =>
          selectedCategory ? item.category === selectedCategory : true
        )
      );
    } else {
      const filtered = menuItems.filter(
        (item) =>
          item.title.toLowerCase().includes(text.toLowerCase()) &&
          (selectedCategory ? item.category === selectedCategory : true)
      );
      setFilteredItems(filtered);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFilteredItems(menuItems.filter((item) => item.category === category));
    console.log()
  };

  return (
    <>
      {/* Header with Search & Cart */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 p-2">
        <input
          type="text"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ flex: 1, marginRight: 10 ,borderRadius:5,padding:10,backgroundColor:'#2b2b2b'}}
        />
        <div onClick={() => setCartVisible(true)} style={{ position: "relative" }}>
          <IoCartOutline size={28} color="white" />
          {cart.length > 0 && (
            <Badge pill bg="danger" style={{ position: "absolute", top: -5, right: -5 }}>
              {cart.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="d-flex mb-3" style={{gap:10}}>
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="secondary"
            onClick={() => handleCategorySelect(category)}
            className={`mr-2 ${selectedCategory === category ? "bg-primary text-white" : ""}`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div>
        {/* Show loading indicator */}
        {loading && <Spinner animation="border" variant="primary" />}

        {/* Show error message if it exists */}
        {error && <div className="text-danger">{error}</div>}

        {/* Ensure filteredItems exists before using length */}
        {filteredItems?.length > 0 ? (
          <div className="d-flex flex-wrap justify-content-center">
            {filteredItems.map((item) => (
              <Card key={item.id+item.category} className="m-2" style={{ minWidth: "250px",height:300 }}>
                <Card.Img variant="top" src={item.img} style={{height:'48%'}}/>
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>₦{item.price}</Card.Text>
                  <Button variant="primary" onClick={() => addToCart(item)}>
                    Order Now
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          !loading && <div>No items found.</div>
        )}
      </div>

      {/* Cart Modal */}
      <Modal show={cartVisible} onHide={() => setCartVisible(false)} animation="slide">
        <Modal.Header closeButton>
          <Modal.Title>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <div>Your cart is empty.</div>
          ) : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <span>{item.title}</span>
                  <span>{item.quantity}</span>
                  <div onClick={() => removeFromCart(item.id)}>
                    <IoTrashOutline size={24} color="red" />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="primary"
            onClick={() => navigate("/checkoutscreen")}
          >
            Go to Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Menu;
