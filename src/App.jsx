import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import VendorSignup from "./pages/VendorSignup";
import MyOrders from "./pages/MyOrders";
import ProductDetails from "./pages/ProductDetails";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import Orders from "./admin/Orders";
import Vendors from "./admin/Vendors";
import VendorPayouts from "./admin/VendorPayouts";

import VendorLayout from "./vendor/VendorLayout";
import VendorStore from "./vendor/VendorStore";
import VendorOrders from "./vendor/VendorOrders";
import VendorEarnings from "./vendor/VendorEarnings";

function StorePage({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* STORE ROUTES */}

        <Route
          path="/"
          element={
            <StorePage>
              <Home />
            </StorePage>
          }
        />

        <Route
          path="/shop"
          element={
            <StorePage>
              <Shop />
            </StorePage>
          }
        />

        <Route
          path="/cart"
          element={
            <StorePage>
              <Cart />
            </StorePage>
          }
        />

        <Route
          path="/wishlist"
          element={
            <StorePage>
              <Wishlist />
            </StorePage>
          }
        />

        <Route
          path="/checkout"
          element={
            <StorePage>
              <Checkout />
            </StorePage>
          }
        />

        <Route
          path="/login"
          element={
            <StorePage>
              <Login />
            </StorePage>
          }
        />

        <Route
          path="/signup"
          element={
            <StorePage>
              <Signup />
            </StorePage>
          }
        />

        <Route
          path="/account"
          element={
            <StorePage>
              <Account />
            </StorePage>
          }
        />

        <Route
          path="/contact"
          element={
            <StorePage>
              <Contact />
            </StorePage>
          }
        />

        <Route
          path="/vendor"
          element={
            <StorePage>
              <VendorSignup />
            </StorePage>
          }
        />

        <Route
          path="/my-orders"
          element={
            <StorePage>
              <MyOrders />
            </StorePage>
          }
        />

        <Route
          path="/product/:id"
          element={
            <StorePage>
              <ProductDetails />
            </StorePage>
          }
        />

        <Route
          path="/success"
          element={
            <StorePage>
              <OrderSuccess />
            </StorePage>
          }
        />

        {/* ADMIN ROUTES */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="payouts" element={<VendorPayouts />} />
        </Route>

        {/* VENDOR ROUTES */}

        <Route path="/vendor-dashboard" element={<VendorLayout />}>
          <Route index element={<VendorStore />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="earnings" element={<VendorEarnings />} />
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={
            <StorePage>
              <NotFound />
            </StorePage>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}