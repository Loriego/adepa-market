import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

/* AUTH */
import Signup from "./pages/Signup";
import VendorSignup from "./pages/VendorSignup";

/* MAIN PAGES */
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Success from "./pages/Success";

/* ADMIN */
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ManageProducts from "./admin/ManageProducts";
import Orders from "./admin/Orders";
import Vendors from "./admin/Vendors";
import VendorPayouts from "./admin/VendorPayouts";
import SendNotification from "./admin/SendNotification";
import AdminLayout from "./admin/AdminLayout";

/* VENDOR */
import VendorLayout from "./vendor/VendorLayout";
import VendorDashboard from "./vendor/VendorDashboard";
import VendorAddProduct from "./vendor/VendorAddProduct";
import VendorProducts from "./vendor/VendorProducts";
import VendorEditProduct from "./vendor/VendorEditProduct";
import VendorOrders from "./vendor/VendorOrders";
import VendorEarnings from "./vendor/VendorEarnings";
import VendorStore from "./pages/VendorStore";

/* CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

/* NOT FOUND */
function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        fontWeight: "900",
      }}
    >
      404 NOT FOUND
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* MAIN WEBSITE */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/shop"
                element={
                  <>
                    <Navbar />
                    <Shop />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/product/:id"
                element={
                  <>
                    <Navbar />
                    <ProductDetails />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/cart"
                element={
                  <>
                    <Navbar />
                    <Cart />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/checkout"
                element={
                  <>
                    <Navbar />
                    <Checkout />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <>
                    <Navbar />
                    <Wishlist />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/success"
                element={
                  <>
                    <Navbar />
                    <Success />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/vendor-store/:vendorId"
                element={
                  <>
                    <Navbar />
                    <VendorStore />
                    <Footer />
                  </>
                }
              />

              {/* AUTH */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/vendor-signup" element={<VendorSignup />} />

              {/* ADMIN LOGIN */}
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* ADMIN DASHBOARD */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route
                  path="manage-products"
                  element={<ManageProducts />}
                />
                <Route path="orders" element={<Orders />} />
                <Route path="vendors" element={<Vendors />} />
                <Route
                  path="vendor-payouts"
                  element={<VendorPayouts />}
                />
                <Route
                  path="send-notification"
                  element={<SendNotification />}
                />
              </Route>

              {/* VENDOR DASHBOARD */}
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="add-product" element={<VendorAddProduct />} />
                <Route path="products" element={<VendorProducts />} />
                <Route
                  path="edit-product/:id"
                  element={<VendorEditProduct />}
                />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="earnings" element={<VendorEarnings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}