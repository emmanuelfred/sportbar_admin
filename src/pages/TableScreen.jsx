import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation in React
import Header from "../component/Header";
import "../styles/TableScreen.css"; // Import the CSS for styling

const TableScreen = () => {
  const [tables, setTables] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error checking user login:", error);
    }
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const { name, staff_id, logName } = parsedUser;

          const response = await fetch(
            `https://thesportsbar.com.ng/sport/get_active_tables.php?attendant=${name}&staff_id=${staff_id}&log_name=${logName}`
          );
          const data = await response.json();

          if (data.success) {
            const groupedTables = data.tables.reduce((acc, item) => {
              if (!acc[item.table_num]) {
                acc[item.table_num] = [];
              }
              acc[item.table_num].push(item);
              return acc;
            }, {});
            setTables(groupedTables);
          } else {
            setTables({});
          }
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const addToCart = (orders) => {
    try {
      const updatedCart = orders.map((item) => ({
        id: item.item_id,
        title: item.item_name,
        price: item.item_price,
        quantity: item.item_portion || 1,
      }));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="header">Active Tables</h1>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : Object.keys(tables).length === 0 ? (
          <p className="no-tables">No active tables found.</p>
        ) : (
          <ul className="table-list">
            {Object.keys(tables).map((item) => {
              const firstOrder = tables[item][0]; // Get first order from the group
              return (
                <li
                  key={item}
                  className="table-item"
                  onClick={() => {
                    const orders = tables[item].map((order) => ({
                      item_id: order.item_id,
                      item_name: order.item_name,
                      item_price: order.item_price,
                      item_portion: order.item_portion,
                    }));

                    addToCart(orders);
                    const query = new URLSearchParams({
                        staff_id: firstOrder.Staff_id,
                        log_name: user?.logName || "Guest",
                        table_number: firstOrder.table_num,
                        orders: encodeURIComponent(JSON.stringify(tables[item])),
                      }).toString();
                    
                      navigate(`/AllOrderScreen?${query}`);

                    
                  }}
                >
                  <h3 className="table-title">Table {item}</h3>
                  <p className="attendant-text">Attendant: {firstOrder.attendant}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default TableScreen;
