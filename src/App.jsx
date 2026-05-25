import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";

/* AUTH */
import Signup from "./pages/Signup";
import VendorSignup from "./pages/VendorSignup";

/* MAIN PAGES */
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import VendorStore from "./pages/VendorStore";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Success from "./pages/Success";
import TrackOrder from "./pages/TrackOrder";

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

/* CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

function StorePage({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <StorePage>
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <h1 className="text-5xl font-black">404 NOT FOUND</h1>
      </main>
    </StorePage>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster position="top-right" />

            <Routes>
              <Route path="/" element={<StorePage><Home /></StorePage>} />
              <Route path="/shop" element={<StorePage><Shop /></StorePage>} />
              <Route path="/product/:id" element={<StorePage><ProductDetails /></StorePage>} />
              <Route path="/vendor-store/:vendorId" element={<StorePage><VendorStore /></StorePage>} />
              <Route path="/cart" element={<StorePage><Cart /></StorePage>} />
              <Route path="/checkout" element={<StorePage><Checkout /></StorePage>} />
              <Route path="/wishlist" element={<StorePage><Wishlist /></StorePage>} />
              <Route path="/success" element={<StorePage><Success /></StorePage>} />
              <Route path="/track-order" element={<StorePage><TrackOrder /></StorePage>} />

              <Route path="/signup" element={<Signup />} />
              <Route path="/vendor-signup" element={<VendorSignup />} />

              <Route path="/admin-login" element={<AdminLogin />} />

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
                <Route path="manage-products" element={<ManageProducts />} />
                <Route path="orders" element={<Orders />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="vendor-payouts" element={<VendorPayouts />} />
                <Route path="send-notification" element={<SendNotification />} />
              </Route>

              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="add-product" element={<VendorAddProduct />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="edit-product/:id" element={<VendorEditProduct />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="earnings" element={<VendorEarnings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}