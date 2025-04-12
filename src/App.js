import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


// Import all screens (components)
import Home from './pages/Home'; // This is like "index"
import SaleLogin from './pages/SaleLogin';
import Dashboard from './pages/Dashboard';
import CheckoutScreen from './pages/CheckoutScreen';
import AllOrderScreen from './pages/AllOrderScreen';
import ProfileScreen from './pages/ProfileScreen';
import TableScreen from './pages/TableScreen';
import ServedTable from './pages/ServedTable';
import LogoutScreen from './pages/LogoutScreen';
import ReturnTable from './pages/ReturnTable';
import ReturnItem from './pages/ReturnItem';
import Customer from './pages/Customer';
/*
import SeeOrderScreen from './pages/SeeOrderScreen';



*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
          <Route index element={<Home />} />
          <Route path="/salelogin" element={<SaleLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkoutscreen" element={<CheckoutScreen />} />
          <Route path="allorderscreen" element={<AllOrderScreen />} />
          <Route path="profilescreen" element={<ProfileScreen />} />
          <Route path="tablescreen" element={<TableScreen />} />
          <Route path="servedtable" element={<ServedTable />} />
          <Route path="logoutscreen" element={<LogoutScreen />} />
          <Route path="returntable" element={<ReturnTable />} />
          <Route path="returnitem" element={<ReturnItem />} />
          <Route path="customer" element={<Customer />} />
          {/*
          
     
          <Route path="seeorderscreen" element={<SeeOrderScreen />} />
          
          
          
        
         */}
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
