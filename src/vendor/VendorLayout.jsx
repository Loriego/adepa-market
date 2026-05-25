import { NavLink, Outlet } from "react-router-dom";
import {
  FiGrid,
  FiPlusCircle,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiHome,
} from "react-icons/fi";

export default function VendorLayout() {
  const menu = [
    { name: "Dashboard", icon: <FiGrid />, path: "/vendor-dashboard" },
    { name: "Add Product", icon: <FiPlusCircle />, path: "/vendor-dashboard/add-product" },
    { name: "My Products", icon: <FiPackage />, path: "/vendor-dashboard/products" },
    { name: "Orders", icon: <FiShoppingBag />, path: "/vendor-dashboard/orders" },
    { name: "Earnings", icon: <FiDollarSign />, path: "/vendor-dashboard/earnings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex overflow-x-hidden">
      <aside className="w-[280px] shrink-0 min-h-screen bg-white p-7 shadow-xl sticky top-0">
        <h1 className="text-5xl font-black text-orange-600 leading-none">
          Vendor Panel
        </h1>

        <p className="text-gray-500 mt-4 text-lg">Adepa Seller Center</p>

        <div className="mt-10 flex flex-col gap-5">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/vendor-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-lg transition ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-orange-100"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}

          <a
            href="/"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-lg bg-black text-white"
          >
            <FiHome className="text-2xl" />
            View Marketplace
          </a>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}