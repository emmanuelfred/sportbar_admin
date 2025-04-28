import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../component/Header";
import "../styles/ReturnItem.css";

const ReturnItem = () => {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    
    const staff_id = searchParams.get("staff_id");
    const log_name = searchParams.get("log_name");
    const table_number = searchParams.get("table_number");
    const ordersString = searchParams.get("orders");
    const orders = ordersString ? JSON.parse(decodeURIComponent(ordersString)) : [];

    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
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

    const toggleSelection = (itemId, portion) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [itemId]: portion
        }));
    };

    const handleReturn = async () => {
        if (Object.keys(selectedItems).length === 0) {
            alert("Please select items and enter portion to return.");
            return;
        }

        // Validate all portions
        for (const itemId in selectedItems) {
            const portion = selectedItems[itemId];
            if (!portion || isNaN(portion) || portion <= 0) {
                alert("Please enter a valid portion for all selected items.");
                return;
            }
        }

        try {
            const response = await fetch("https://thesportsbar.com.ng/sport/return_items.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    table_number,
                    staff_id,
                    log_name,
                    items: selectedItems, // send {itemId: portion} format
                }),
            });

            console.log("Sending Request:", {
                table_number,
                staff_id,
                log_name,
                items: selectedItems,
            });

            const result = await response.json();
            if (result.success) {
                alert("Items returned successfully!");
            
                // Refresh the page
                window.location.reload();
            } else {
                console.log("Return Error:", result.errors || result.message);
                alert("Failed to return items.");
            }
            
        } catch (error) {
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
                                    checked={selectedItems[item.id] !== undefined}
                                    onChange={(e) => {
                                        if (!e.target.checked) {
                                            const copy = { ...selectedItems };
                                            delete copy[item.id];
                                            setSelectedItems(copy);
                                        } else {
                                            toggleSelection(item.id, "");
                                        }
                                    }}
                                />
                                <span>{item.item_name} - ₦{parseFloat(item.item_price).toLocaleString()} (Available: {item.item_portion})</span>

                                {selectedItems[item.id] !== undefined && (
                                    <input
                                        type="number"
                                        className="portion-input"
                                        placeholder="Portion to return"
                                        value={selectedItems[item.id]}
                                        min="1"
                                        onChange={(e) => toggleSelection(item.id, e.target.value)}
                                    />
                                )}
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
