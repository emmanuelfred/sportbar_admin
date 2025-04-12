import React from "react";
import Menu from "../component/Menu";
import Header from "../component/Header";


const Dashboard = () => {




  return (
    <div style={styles.container}>
      <Header />
      <Menu  /> {/* Re-renders when refreshKey changes */}
    </div>
  );
};

export default Dashboard;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#121212",
    padding: "10px",

  },
};
