import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  X,
  Heart,
  Home,
  Store,
  Phone,
  Package,
  BriefcaseBusiness,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-full font-bold transition-all duration-300 whitespace-nowrap ${
      isActive
        ? "bg-orange-600 text-white shadow-lg"
        : "text-black hover:bg-orange-50 hover:text-orange-600"
    }`;

  return (
    <>
<motion.nav
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.4 }}
  className="sticky top-0 z-[9999] bg-white/95 backdrop-blur-xl shadow-sm overflow-visible"
>      
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-2xl lg:text-3xl font-black text-orange-600 whitespace-nowrap flex-shrink-0"
          >
            Adepa Market
          </Link>

          <div className="hidden xl:flex items-center gap-1 text-sm flex-shrink">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/shop" className={navClass}>
              Shop
            </NavLink>

            <NavLink to="/wishlist" className={navClass}>
              Wishlist
            </NavLink>

            <NavLink to="/my-orders" className={navClass}>
              Orders
            </NavLink>

            <NavLink to="/vendor" className={navClass}>
              Sell
            </NavLink>

            <NavLink to="/vendor-dashboard" className={navClass}>
              Vendor
            </NavLink>

            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>
          </div>

          <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
            {user && <NotificationBell />}

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 transition ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-orange-600 text-white hover:bg-black"
                }`
              }
            >
              <ShoppingCart size={18} />
              <span>{cartItems.length}</span>
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full font-black text-sm transition ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    }`
                  }
                >
                  Account
                </NavLink>

                <div className="bg-slate-100 px-3 py-2 rounded-full font-bold text-sm flex items-center gap-2 max-w-[120px] truncate">
                  <User size={15} />
                  <span className="truncate">{user?.email?.split("@")[0]}</span>
                </div>

                <button
                  onClick={logout}
                  className="bg-black text-white px-3 py-2 rounded-full font-black text-sm flex items-center gap-2 hover:bg-red-600 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-full font-black text-sm transition ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "bg-black text-white hover:bg-orange-600"
                    }`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-full font-black text-sm transition ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-orange-600 text-white hover:bg-black"
                    }`
                  }
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>

          <div className="xl:hidden flex items-center gap-3">
            {user && <NotificationBell />}

            <NavLink
              to="/cart"
              className="bg-orange-600 text-white px-4 py-2 rounded-full font-black flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              {cartItems.length}
            </NavLink>

            <button
              onClick={() => setOpen(true)}
              className="bg-black text-white w-11 h-11 rounded-full flex items-center justify-center"
            >
              <Menu />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-orange-600">
                  Adepa Market
                </h2>

                <button onClick={() => setOpen(false)}>
                  <X size={28} />
                </button>
              </div>

              {user && (
                <div className="bg-orange-50 rounded-3xl p-5 mb-6">
                  <p className="font-black">Logged in as</p>
                  <p className="text-gray-600 break-all">{user.email}</p>
                </div>
              )}

              <div className="grid gap-4 font-black">
                <NavLink onClick={() => setOpen(false)} to="/" className={navClass}>
                  <span className="flex items-center gap-3">
                    <Home size={20} />
                    Home
                  </span>
                </NavLink>

                <NavLink onClick={() => setOpen(false)} to="/shop" className={navClass}>
                  <span className="flex items-center gap-3">
                    <Store size={20} />
                    Shop
                  </span>
                </NavLink>

                <NavLink
                  onClick={() => setOpen(false)}
                  to="/wishlist"
                  className={navClass}
                >
                  <span className="flex items-center gap-3">
                    <Heart size={20} />
                    Wishlist ({wishlist.length})
                  </span>
                </NavLink>

                <NavLink onClick={() => setOpen(false)} to="/cart" className={navClass}>
                  <span className="flex items-center gap-3">
                    <ShoppingCart size={20} />
                    Cart ({cartItems.length})
                  </span>
                </NavLink>

                <NavLink
                  onClick={() => setOpen(false)}
                  to="/my-orders"
                  className={navClass}
                >
                  <span className="flex items-center gap-3">
                    <Package size={20} />
                    My Orders
                  </span>
                </NavLink>

                <NavLink
                  onClick={() => setOpen(false)}
                  to="/vendor"
                  className={navClass}
                >
                  <span className="flex items-center gap-3">
                    <BriefcaseBusiness size={20} />
                    Sell on Adepa
                  </span>
                </NavLink>

                <NavLink
                  onClick={() => setOpen(false)}
                  to="/vendor-dashboard"
                  className={navClass}
                >
                  <span className="flex items-center gap-3">
                    <Store size={20} />
                    Vendor Dashboard
                  </span>
                </NavLink>

                <NavLink
                  onClick={() => setOpen(false)}
                  to="/contact"
                  className={navClass}
                >
                  <span className="flex items-center gap-3">
                    <Phone size={20} />
                    Contact
                  </span>
                </NavLink>

                {user ? (
                  <>
                    <NavLink
                      onClick={() => setOpen(false)}
                      to="/account"
                      className="bg-orange-600 text-white p-4 rounded-2xl text-center flex items-center justify-center gap-3"
                    >
                      <User size={20} />
                      Account
                    </NavLink>

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="bg-black text-white p-4 rounded-2xl flex items-center justify-center gap-3"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      onClick={() => setOpen(false)}
                      to="/login"
                      className="bg-black text-white p-4 rounded-2xl text-center"
                    >
                      Login
                    </NavLink>

                    <NavLink
                      onClick={() => setOpen(false)}
                      to="/signup"
                      className="bg-orange-600 text-white p-4 rounded-2xl text-center"
                    >
                      Signup
                    </NavLink>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}