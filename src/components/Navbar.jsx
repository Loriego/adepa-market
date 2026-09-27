import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  X,
  Heart,
  Home,
  Grid2X2,
  Tag,
  PackagePlus,
  Search,
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
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const submitSearch = (e) => {
    e.preventDefault();
    const value = search.trim();
    navigate(value ? `/shop?search=${encodeURIComponent(value)}` : "/shop");
  };

  const desktopNavClass = ({ isActive }) =>
    `group flex flex-col items-center justify-center min-w-[72px] px-3 py-2 font-bold transition ${
      isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `px-4 py-3 rounded-2xl font-black transition ${
      isActive ? "bg-orange-600 text-white" : "text-gray-800 hover:bg-orange-50"
    }`;

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="sticky top-0 z-[9999] bg-white/90 backdrop-blur-2xl border-b border-slate-200/70 shadow-[0_6px_24px_rgba(15,23,42,0.04)]"
      >
        <div className="max-w-[1500px] mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={() => setOpen(true)}
              className="hidden lg:flex w-11 h-11 items-center justify-center rounded-xl hover:bg-orange-50 hover:text-orange-600 transition"
              aria-label="Open menu"
            >
              <Menu size={25} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
                <ShoppingCart size={25} />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-lg lg:text-xl font-black text-gray-950">
                  Adepa
                </span>
                <span className="text-lg lg:text-xl font-black text-orange-600">
                  Market
                </span>
                <p className="text-[10px] text-gray-400 font-bold tracking-wide">
                  Shop smart. Shop local.
                </p>
              </div>
            </Link>

            <div className="hidden xl:flex items-stretch border-l border-gray-200 pl-4 gap-1">
              <NavLink to="/" className={desktopNavClass}>
                <Home size={21} />
                <span className="text-[11px] mt-1">HOME</span>
              </NavLink>

              <NavLink to="/shop" className={desktopNavClass}>
                <Grid2X2 size={21} />
                <span className="text-[11px] mt-1">CATEGORIES</span>
              </NavLink>

              <NavLink to="/shop?deals=true" className={desktopNavClass}>
                <Tag size={21} />
                <span className="text-[11px] mt-1">DEALS</span>
              </NavLink>

              <NavLink to="/shop?sort=newest" className={desktopNavClass}>
                <PackagePlus size={21} />
                <span className="text-[11px] mt-1">NEW ARRIVALS</span>
              </NavLink>
            </div>

            <form
              onSubmit={submitSearch}
              className="hidden md:flex flex-1 max-w-xl ml-auto"
            >
              <div className="flex w-full rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 min-w-0 bg-transparent px-5 py-3 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="w-12 bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition"
                  aria-label="Search"
                >
                  <Search size={21} />
                </button>
              </div>
            </form>

            <div className="hidden lg:flex items-center gap-1 ml-auto md:ml-0">
              {user && <NotificationBell />}

              <NavLink
                to={user ? "/account" : "/login"}
                className="flex flex-col items-center justify-center px-3 py-1.5 text-gray-700 hover:text-orange-600 transition"
              >
                <User size={23} />
                <span className="text-[11px] font-bold mt-1">Account</span>
              </NavLink>

              <NavLink
                to="/wishlist"
                className="relative flex flex-col items-center justify-center px-3 py-1.5 text-gray-700 hover:text-orange-600 transition"
              >
                <Heart size={23} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
                <span className="text-[11px] font-bold mt-1">Wishlist</span>
              </NavLink>

              <NavLink
                to="/cart"
                className="relative flex flex-col items-center justify-center px-3 py-1.5 text-gray-700 hover:text-orange-600 transition"
              >
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                <span className="text-[11px] font-bold mt-1">Cart</span>
              </NavLink>
            </div>

            <div className="lg:hidden flex items-center gap-2 ml-auto">
              <NavLink to="/cart" className="relative p-2">
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </NavLink>
              <button
                onClick={() => setOpen(true)}
                className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>
            </div>
          </div>

          <form onSubmit={submitSearch} className="md:hidden mt-3 flex">
            <div className="flex w-full rounded-full border border-gray-200 bg-gray-50 overflow-hidden">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 min-w-0 bg-transparent px-5 py-3 outline-none text-sm"
              />
              <button
                type="submit"
                className="w-14 bg-orange-600 text-white flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
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
              className="fixed inset-0 bg-black/50 z-[10000]"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed top-0 left-0 h-full w-[88%] max-w-sm bg-white z-[10001] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-7">
                <Link to="/" onClick={() => setOpen(false)} className="text-2xl font-black">
                  Adepa<span className="text-orange-600">Market</span>
                </Link>
                <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={24} />
                </button>
              </div>

              {user && (
                <div className="bg-orange-50 rounded-2xl p-4 mb-5">
                  <p className="font-black">Welcome back</p>
                  <p className="text-sm text-gray-600 break-all">{user.email}</p>
                </div>
              )}

              <div className="grid gap-2">
                <NavLink onClick={() => setOpen(false)} to="/" className={mobileNavClass}><span className="flex items-center gap-3"><Home size={20} />Home</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/shop" className={mobileNavClass}><span className="flex items-center gap-3"><Grid2X2 size={20} />Shop & Categories</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/wishlist" className={mobileNavClass}><span className="flex items-center gap-3"><Heart size={20} />Wishlist ({wishlist.length})</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/cart" className={mobileNavClass}><span className="flex items-center gap-3"><ShoppingCart size={20} />Cart ({cartItems.length})</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/my-orders" className={mobileNavClass}><span className="flex items-center gap-3"><Package size={20} />My Orders</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/vendor" className={mobileNavClass}><span className="flex items-center gap-3"><BriefcaseBusiness size={20} />Sell on Adepa</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/vendor-dashboard" className={mobileNavClass}><span className="flex items-center gap-3"><Store size={20} />Vendor Dashboard</span></NavLink>
                <NavLink onClick={() => setOpen(false)} to="/contact" className={mobileNavClass}><span className="flex items-center gap-3"><Phone size={20} />Contact</span></NavLink>

                {user ? (
                  <>
                    <NavLink onClick={() => setOpen(false)} to="/account" className="mt-3 bg-orange-600 text-white p-4 rounded-2xl text-center font-black flex items-center justify-center gap-2"><User size={20} />Account</NavLink>
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="bg-black text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2"
                    >
                      <LogOut size={20} />Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <NavLink onClick={() => setOpen(false)} to="/login" className="bg-black text-white p-4 rounded-2xl text-center font-black">Login</NavLink>
                    <NavLink onClick={() => setOpen(false)} to="/signup" className="bg-orange-600 text-white p-4 rounded-2xl text-center font-black">Signup</NavLink>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
