import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Boxes,
  ShoppingBag,
  Wallet,
  LogOut,
  Home,
  Store,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function VendorLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-4 rounded-2xl font-black transition ${
      isActive
        ? "bg-orange-600 text-white shadow-lg"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex">
      <aside className="hidden lg:flex w-72 bg-white min-h-screen p-5 shadow-xl flex-col fixed left-0 top-0 bottom-0">
        <Link to="/vendor/dashboard" className="mb-8">
          <h1 className="text-3xl font-black text-orange-600">
            Vendor Panel
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            Adepa Seller Center
          </p>
        </Link>

        <nav className="grid gap-3 flex-1">
          <NavLink to="/vendor/dashboard" className={navClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/vendor/add-product" className={navClass}>
            <PlusCircle size={20} />
            Add Product
          </NavLink>

          <NavLink to="/vendor/products" className={navClass}>
            <Boxes size={20} />
            My Products
          </NavLink>

          <NavLink to="/vendor/orders" className={navClass}>
            <ShoppingBag size={20} />
            Orders
          </NavLink>

          <NavLink to="/vendor/earnings" className={navClass}>
            <Wallet size={20} />
            Earnings
          </NavLink>
        </nav>

        <div className="grid gap-3">
          <Link
            to="/shop"
            className="flex items-center gap-3 px-5 py-4 rounded-2xl font-black bg-slate-100 hover:bg-black hover:text-white transition"
          >
            <Store size={20} />
            View Marketplace
          </Link>

          <Link
            to="/"
            className="flex items-center gap-3 px-5 py-4 rounded-2xl font-black bg-slate-100 hover:bg-black hover:text-white transition"
          >
            <Home size={20} />
            Visit Store
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl font-black bg-black text-white hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <section className="flex-1 lg:ml-72">
        <div className="lg:hidden bg-white p-4 sticky top-0 z-50 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-orange-600">
              Vendor Panel
            </h1>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-full font-black"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <NavLink to="/vendor/dashboard" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/vendor/add-product" className={navClass}>
              Add
            </NavLink>

            <NavLink to="/vendor/products" className={navClass}>
              Products
            </NavLink>

            <NavLink to="/vendor/orders" className={navClass}>
              Orders
            </NavLink>

            <NavLink to="/vendor/earnings" className={navClass}>
              Earnings
            </NavLink>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}