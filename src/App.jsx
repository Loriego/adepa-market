import { BrowserRouter, Routes, Route } from "react-router-dom";

// CONTEXTS
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

// PAGES
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import MyOrders from "./pages/MyOrders";
import TrackOrder from "./pages/TrackOrder";
import ProductDetails from "./pages/ProductDetails";
import Success from "./pages/Success";
import OrderSuccess from "./pages/OrderSuccess";
import VendorSignup from "./pages/VendorSignup";
import VendorStore from "./pages/VendorStore";
import NotFound from "./pages/NotFound";

// ADMIN
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ManageProducts from "./admin/ManageProducts";
import Orders from "./admin/Orders";
import Vendors from "./admin/Vendors";
import VendorPayouts from "./admin/VendorPayouts";
import SendNotification from "./admin/SendNotification";

// VENDOR
import VendorLayout from "./vendor/VendorLayout";
import VendorDashboard from "./vendor/VendorDashboard";
import VendorProducts from "./vendor/VendorProducts";
import VendorAddProduct from "./vendor/VendorAddProduct";
import VendorEditProduct from "./vendor/VendorEditProduct";
import VendorOrders from "./vendor/VendorOrders";
import VendorEarnings from "./vendor/VendorEarnings";

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* CUSTOMER ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/success" element={<Success />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* SELLER SIGNUP / STORE */}
              <Route path="/vendor" element={<VendorSignup />} />
              <Route path="/sell" element={<VendorSignup />} />
              <Route path="/vendor-signup" element={<VendorSignup />} />
              <Route path="/vendor-store" element={<VendorStore />} />
              <Route path="/vendor-store/:vendorId" element={<VendorStore />} />

              {/* VENDOR DASHBOARD ROUTES */}
              <Route path="/vendor-dashboard" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="add-product" element={<VendorAddProduct />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="edit-product/:id" element={<VendorEditProduct />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="earnings" element={<VendorEarnings />} />
              </Route>

              {/* OLD VENDOR LINKS SUPPORT */}
              <Route path="/vendor/dashboard" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
              </Route>
              <Route path="/vendor/add-product" element={<VendorAddProduct />} />
              <Route path="/vendor/products" element={<VendorProducts />} />
              <Route path="/vendor/edit-product/:id" element={<VendorEditProduct />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
              <Route path="/vendor/earnings" element={<VendorEarnings />} />

              {/* ADMIN ROUTES */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />

              {/* BOTH LINKS WORK NOW */}
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/manage-products" element={<ManageProducts />} />

              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/vendors" element={<Vendors />} />
              <Route path="/admin/vendor-payouts" element={<VendorPayouts />} />
              <Route path="/admin/payouts" element={<VendorPayouts />} />
              <Route path="/admin/send-notification" element={<SendNotification />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}