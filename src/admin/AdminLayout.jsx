import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Boxes,
  ClipboardList,
  Store,
  Wallet,
  Bell,
  LogOut,
  Home,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
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
    navigate("/admin");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex">
      <aside className="hidden lg:flex w-72 bg-white min-h-screen p-5 shadow-xl flex-col fixed left-0 top-0 bottom-0">
        <Link to="/admin/dashboard" className="mb-8">
          <h1 className="text-3xl font-black text-orange-600">
            Adepa Admin
          </h1>
          <p className="text-gray-500 font-bold text-sm">
            Marketplace Control
          </p>
        </Link>

        <nav className="grid gap-3 flex-1">
          <NavLink to="/admin/dashboard" className={navClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/add-product" className={navClass}>
            <PlusCircle size={20} />
            Add Product
          </NavLink>

          <NavLink to="/admin/products" className={navClass}>
            <Boxes size={20} />
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={navClass}>
            <ClipboardList size={20} />
            Orders
          </NavLink>

          <NavLink to="/admin/vendors" className={navClass}>
            <Store size={20} />
            Vendors
          </NavLink>

          <NavLink to="/admin/vendor-payouts" className={navClass}>
            <Wallet size={20} />
            Payouts
          </NavLink>

          <NavLink to="/admin/send-notification" className={navClass}>
            <Bell size={20} />
            Notifications
          </NavLink>
        </nav>

        <div className="grid gap-3">
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
              Adepa Admin
            </h1>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-full font-black"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <NavLink to="/admin/dashboard" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/products" className={navClass}>
              Products
            </NavLink>

            <NavLink to="/admin/orders" className={navClass}>
              Orders
            </NavLink>

            <NavLink to="/admin/vendors" className={navClass}>
              Vendors
            </NavLink>

            <NavLink to="/admin/vendor-payouts" className={navClass}>
              Payouts
            </NavLink>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}