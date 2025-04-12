import React, { useEffect, useState } from "react";
import { useLocation,useSearchParams } from "react-router-dom"; // For handling URL parameters
import Header from "../component/Header"; // Assuming you have a Header component
import '../styles/ReturnItem.css'; // Assuming you have a separate CSS file for styling

const ReturnItem = () => {
    const { state } = useLocation(); // Using react-router's useLocation to access the parameters
     const [searchParams] = useSearchParams();
    
      const staff_id = searchParams.get("staff_id");
      const log_name = searchParams.get("log_name");
      const table_number = searchParams.get("table_number");
      const ordersString = searchParams.get("orders");
      const orders = ordersString ? JSON.parse(decodeURIComponent(ordersString)) : [];

    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(
                    `https://thesportsbar.com.ng/sport/get_items.php?staff_id=${staff_id}&log_name=${log_name}&table_number=${table_number}`
                );
                const data = await response.json();

                if (data.success) {
                    setItems(data.items);
                } else {
                    setItems([]);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [staff_id, log_name, table_number]);

    const toggleSelection = (itemId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemId)
                ? prevSelected.filter((id) => id !== itemId)
                : [...prevSelected, itemId]
        );
    };

    const handleReturn = async () => {
        // Check if any items are selected
        if (selectedItems.length === 0) {
            alert("Please select items to return.");
            return;
        }

        try {
            // Send the selected items to the backend
            const response = await fetch("https://thesportsbar.com.ng/sport/return_items.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    table_number,
                    staff_id,
                    log_name,
                    items: selectedItems,
                }),
            });

            // Log request details for debugging
            console.log("Sending Request:", {
                table_number,
                staff_id,
                log_name,
                items: selectedItems,
            });

            // Parse the response
            const result = await response.json();

            // Check if the response indicates success
            if (result.success) {
                // Filter out the returned items from the list of items
                setItems((prevItems) => prevItems.filter((item) => !selectedItems.includes(item.id)));

                // Clear selected items
                setSelectedItems([]);

                // Show success message
                alert("Items returned successfully!");
            } else {
                // Handle failure case
                console.log("Return Error:", result.errors || result.message);
                alert("Failed to return items.");
            }
        } catch (error) {
            // Catch and log any errors
            console.error("Error returning items:", error);
            alert("An error occurred while returning items. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <h1 className="title">Return Items for Table {table_number}</h1>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : items.length === 0 ? (
                    <p className="no-items">No items found.</p>
                ) : (
                    <ul className="item-list">
                        {items.map((item) => (
                            <li key={item.id} className="item-container">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleSelection(item.id)}
                                />
                                <span className="item-text">
                                    {item.item_name} - ₦{parseFloat(item.item_price).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                <button className="return-button" onClick={handleReturn}>
                    Return Selected Items
                </button>
            </div>
        </>
    );
};

export default ReturnItem;
