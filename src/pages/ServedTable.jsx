import React, { useEffect, useState } from "react";

import Header from "../component/Header"; // Ensure this is the correct path to your Header component

const ServedTable = () => {
    const [tables, setTables] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Holds user data
    const [saleToken, setSaleToken] = useState(null);

    // Replaces `useNavigation` in React Native

    useEffect(() => {
        checkUserLogin();
    }, []);

    const checkUserLogin = async () => {
        try {
            const userData = await localStorage.getItem("user");
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
                const userData = await localStorage.getItem("user");
                if (userData) {
                    const user = JSON.parse(userData);
                    const { name, staff_id, logName } = user;

                    const response = await fetch(
                        `https://thesportsbar.com.ng/sport/get_server_tables.php?attendant=${name}&staff_id=${staff_id}&log_name=${logName}`
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
            <div style={styles.container}>
                <h2 style={styles.header}>Active Tables</h2>

                {loading ? (
                    <div style={styles.loader}>Loading...</div> // React's equivalent of ActivityIndicator
                ) : Object.keys(tables).length === 0 ? (
                    <p style={styles.noTables}>No tables found.</p>
                ) : (
                    <ul style={styles.tableList}>
                        {Object.keys(tables).map((item) => {
                            const firstOrder = tables[item][0];

                            return (
                                <li
                                    key={item}
                                    style={styles.tableItem}
                                    onClick={() => {
                                        const orders = tables[item].map((order) => ({
                                            item_id: order.item_id,
                                            item_name: order.item_name,
                                            item_price: order.item_price,
                                            item_portion: order.item_portion,
                                        }));
                                        setSaleToken(firstOrder.sale_token);

                                        // Navigate to ReturnItem screen
                                        // history.push(`/returnItem/${firstOrder.sale_token}`); // Example navigation
                                    }}
                                >
                                    <h3 style={styles.tableTitle}>Table {item}</h3>
                                    <p style={styles.attendantText}>
                                        Transaction Token: {firstOrder.sale_token}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                )}

              
            </div>
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#121212",
        padding: "20px",
    },
    header: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: "20px",
    },
    noTables: {
        fontSize: "18px",
        color: "gray",
        textAlign: "center",
        marginTop: "20px",
    },
    tableItem: {
        backgroundColor: "#1e1e1e",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
        cursor: "pointer",
    },
    tableTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#fff",
    },
    attendantText: {
        color: "#ccc",
        marginTop: "5px",
    },
    backButton: {
        marginTop: "20px",
        backgroundColor: "#014925",
        padding: "12px",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
    },
    loader: {
        color: "#014925",
        fontSize: "20px",
        textAlign: "center",
        marginTop: "20px",
    },
    tableList: {
        listStyleType: "none",
        paddingLeft: "0",
    },
};

export default ServedTable;
