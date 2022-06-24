import React from "react";
import "./css/app.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { Wishlist } from "./pages/wishlist";
import { Cart } from "./pages/cart";
import { Data } from "./pages/data";
import LoginForm from "./pages/LoginForm";
import Form from "./pages/Form";
import { AuthProvider } from "./contexts/AuthContext";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import { Productmanager } from "./pages/ProductManager";
import { Salesmanager } from "./pages/SalesManager";
import Delivery from "./pages/PmDelivery";
import MyOrders from "./pages/myorders";
import MyRefunds from "./pages/myrefunds";
import MyComments from "./pages/comments";
import Refund from "./pages/pmrefund";
import Invoice from "./pages/invoice2";
import ShowingInvoices from "./pages/showingInvoices";
import Revnue from "./pages/revnue";
import Revnue2 from "./pages/revnue2";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/productmanager" element={<Productmanager />} />
          <Route path="/salesmanager" element={<Salesmanager />} />
          <Route path="/mycomments" element={<MyComments />} />
          <Route path="/invoice" render element={<Invoice />} />
          <Route path="/pmdeliveries" render element={<Delivery />} />
          <Route path="/showinginvoice" render element={<ShowingInvoices />} />
          <Route path="/revnue" render element={<Revnue />} />
          <Route path="/revnue2" render element={<Revnue2 />} />
        </Routes>
        <Navbar />
        <Routes>
          <Route path="/welcome" element={<Home />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/products" element={<Data />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/myrefunds" element={<MyRefunds />} />
          <Route
            path="/forgot-password"
            render
            element={<ForgotPasswordForm />}
          />
          <Route path="/Login" render element={<LoginForm />} />
          <Route path="/Signup" render element={<Form />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
