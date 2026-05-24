import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import VendorRoute from "./components/VendorRoute";
import AiShoppingAssistant from "./components/AiShoppingAssistant";
import ScrollToTop from "./components/ScrollToTop";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

import AdminLayout from "./admin/AdminLayout";
import VendorLayout from "./vendor/VendorLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import VendorStore from "./pages/VendorStore";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import VendorSignup from "./pages/VendorSignup";
import NotFound from "./pages/NotFound";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import Orders from "./admin/Orders";
import ManageProducts from "./admin/ManageProducts";
import EditProduct from "./admin/EditProduct";
import SendNotification from "./admin/SendNotification";
import Vendors from "./admin/Vendors";
import VendorPayouts from "./admin/VendorPayouts";

import VendorDashboard from "./vendor/VendorDashboard";
import VendorAddProduct from "./vendor/VendorAddProduct";
import VendorOrders from "./vendor/VendorOrders";
import VendorProducts from "./vendor/VendorProducts";
import VendorEditProduct from "./vendor/VendorEditProduct";
import VendorEarnings from "./vendor/VendorEarnings";

function AdminPage({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}

function VendorPage({ children }) {
  return (
    <VendorRoute>
      <VendorLayout>{children}</VendorLayout>
    </VendorRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-right" />
            <AiShoppingAssistant />
            <FloatingWhatsApp />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/vendor-store/:vendorId" element={<VendorStore />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/become-vendor"
                element={
                  <ProtectedRoute>
                    <VendorSignup />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/vendor/dashboard"
                element={
                  <VendorPage>
                    <VendorDashboard />
                  </VendorPage>
                }
              />

              <Route
                path="/vendor/add-product"
                element={
                  <VendorPage>
                    <VendorAddProduct />
                  </VendorPage>
                }
              />

              <Route
                path="/vendor/orders"
                element={
                  <VendorPage>
                    <VendorOrders />
                  </VendorPage>
                }
              />

              <Route
                path="/vendor/products"
                element={
                  <VendorPage>
                    <VendorProducts />
                  </VendorPage>
                }
              />

              <Route
                path="/vendor/edit-product/:id"
                element={
                  <VendorPage>
                    <VendorEditProduct />
                  </VendorPage>
                }
              />

              <Route
                path="/vendor/earnings"
                element={
                  <VendorPage>
                    <VendorEarnings />
                  </VendorPage>
                }
              />

              <Route path="/admin" element={<AdminLogin />} />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminPage>
                    <AdminDashboard />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/add-product"
                element={
                  <AdminPage>
                    <AddProduct />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <AdminPage>
                    <ManageProducts />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/edit-product/:id"
                element={
                  <AdminPage>
                    <EditProduct />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <AdminPage>
                    <Orders />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/vendors"
                element={
                  <AdminPage>
                    <Vendors />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/vendor-payouts"
                element={
                  <AdminPage>
                    <VendorPayouts />
                  </AdminPage>
                }
              />

              <Route
                path="/admin/send-notification"
                element={
                  <AdminPage>
                    <SendNotification />
                  </AdminPage>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}