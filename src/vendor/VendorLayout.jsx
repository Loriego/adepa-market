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
    {
      name: "Dashboard",
      icon: <FiGrid />,
      path: "/vendor-dashboard",
    },
    {
      name: "Add Product",
      icon: <FiPlusCircle />,
      path: "/vendor/add-product",
    },
    {
      name: "My Products",
      icon: <FiPackage />,
      path: "/vendor/products",
    },
    {
      name: "Orders",
      icon: <FiShoppingBag />,
      path: "/vendor/orders",
    },
    {
      name: "Earnings",
      icon: <FiDollarSign />,
      path: "/vendor/earnings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white shadow-xl p-6">
        <h1 className="text-5xl font-black text-orange-600">
          Vendor Panel
        </h1>

        <p className="text-gray-500 mt-2">
          Adepa Seller Center
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-lg transition ${
                  isActive
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}

          <a
            href="/"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-lg bg-black text-white hover:opacity-90"
          >
            <FiHome className="text-2xl" />
            View Marketplace
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}