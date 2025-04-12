import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { Alert, Button, Spinner } from "react-bootstrap"; // Using Bootstrap for UI components
import Header from "../component/Header"; // Assuming you have a Header component
import '../styles/ReturnTable.css'; // Assuming you are using CSS for styling

const ReturnTable = () => {
  const [tables, setTables] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Holds user data
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
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
          const user = JSON.parse(userData);
          const { name, staff_id, logName } = user;

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

  return (
    <>
      <Header />
      <div className="container">
        <h2 className="header">Active Tables</h2>

        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : Object.keys(tables).length === 0 ? (
          <p className="noTables">No active tables found.</p>
        ) : (
          <div className="tableList" style={{  width: '100%'}}>
            {Object.keys(tables).map((item) => {
              const firstOrder = tables[item][0];

              return (
                <div
                  className="tableItem"
                  key={item}
                  onClick={() => {
                    const orders = tables[item].map((order) => ({
                      item_id: order.item_id,
                      item_name: order.item_name,
                      item_price: order.item_price,
                      item_portion: order.item_portion,
                    }));
                    const query = new URLSearchParams({
                        staff_id: user.staff_id, // Fixed case sensitivity
                        log_name: user?.logName || "Guest",
                        table_number: firstOrder.table_num,
                        orders: encodeURIComponent(JSON.stringify(tables[item])),
                      }).toString();
                    
                      navigate(`/ReturnItem?${query}`);

                    // Navigate to ReturnItem screen
                  
                  }}
                >
                  <h3 className="tableTitle">Table {item}</h3>
                  <p className="attendantText">Attendant: {firstOrder.attendant}</p>
                </div>
              );
            })}
          </div>
        )}

        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </>
  );
};

export default ReturnTable;
