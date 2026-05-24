import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import {
  Package,
  ShoppingBag,
  Banknote,
  Clock,
  PlusCircle,
  ClipboardList,
  Boxes,
  Users,
  TrendingUp,
  Bell,
  Store,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { db } from "../firebase/firebaseConfig";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0,
    pending: 0,
    customers: 0,
    vendors: 0,
    pendingVendors: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const vendorsSnapshot = await getDocs(collection(db, "vendors"));

    let totalSales = 0;
    let pendingOrders = 0;

    const customers = new Set();
    const dailySales = {};
    const categories = {};

    productsSnapshot.docs.forEach((item) => {
      const product = item.data();
      const category = product.category || "Other";

      categories[category] = (categories[category] || 0) + 1;
    });

    ordersSnapshot.docs.forEach((item) => {
      const order = item.data();

      if (order.customer?.email) {
        customers.add(order.customer.email);
      }

      if (order.paymentStatus === "Paid") {
        totalSales += Number(order.total || 0);

        let date = "Unknown";

        if (order.createdAt?.toDate) {
          date = order.createdAt.toDate().toLocaleDateString();
        }

        dailySales[date] = (dailySales[date] || 0) + Number(order.total || 0);
      }

      if (order.deliveryStatus !== "Delivered") {
        pendingOrders += 1;
      }
    });

    const pendingVendors = vendorsSnapshot.docs.filter(
      (item) => item.data().status === "Pending"
    ).length;

    const recentQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const recentSnapshot = await getDocs(recentQuery);

    setRecentOrders(
      recentSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }))
    );

    setSalesData(
      Object.keys(dailySales).map((date) => ({
        date,
        sales: dailySales[date],
      }))
    );

    setCategoryData(
      Object.keys(categories).map((name) => ({
        name,
        value: categories[name],
      }))
    );

    setStats({
      products: productsSnapshot.size,
      orders: ordersSnapshot.size,
      sales: totalSales,
      pending: pendingOrders,
      customers: customers.size,
      vendors: vendorsSnapshot.size,
      pendingVendors,
    });
  };

  const cards = [
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "bg-orange-600",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "bg-black",
    },
    {
      title: "Total Sales",
      value: `GH₵ ${stats.sales}`,
      icon: Banknote,
      color: "bg-green-600",
    },
    {
      title: "Pending Orders",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Vendors",
      value: stats.vendors,
      icon: Store,
      color: "bg-purple-600",
    },
  ];

  const chartColors = ["#ea580c", "#111827", "#16a34a", "#2563eb", "#dc2626"];

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10"
        >
          <div>
            <p className="text-orange-600 font-black">Adepa Market Admin</p>

            <h1 className="text-4xl md:text-5xl font-black">
              Analytics Dashboard
            </h1>

            {stats.pendingVendors > 0 && (
              <p className="mt-3 text-purple-600 font-black">
                {stats.pendingVendors} vendor application(s) waiting for approval
              </p>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/admin/add-product"
              className="bg-orange-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Add Product
            </Link>

            <Link
              to="/admin/products"
              className="bg-white text-black px-6 py-3 rounded-full font-black flex items-center gap-2 border"
            >
              <Boxes size={20} />
              Manage Products
            </Link>

            <Link
              to="/admin/orders"
              className="bg-black text-white px-6 py-3 rounded-full font-black flex items-center gap-2"
            >
              <ClipboardList size={20} />
              View Orders
            </Link>

            <Link
              to="/admin/vendors"
              className="bg-purple-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2"
            >
              <Store size={20} />
              Manage Vendors
            </Link>

            <Link
              to="/admin/vendor-payouts"
              className="bg-green-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2"
            >
              <Wallet size={20} />
              Vendor Payouts
            </Link>

            <Link
              to="/admin/send-notification"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-black flex items-center gap-2"
            >
              <Bell size={20} />
              Send Alerts
            </Link>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-sm"
              >
                <div
                  className={`${card.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-5`}
                >
                  <Icon size={28} />
                </div>

                <p className="text-gray-500 font-bold">{card.title}</p>

                <h2 className="text-3xl font-black mt-2">{card.value}</h2>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-orange-600" />

              <h2 className="text-3xl font-black">Sales Chart</h2>
            </div>

            {salesData.length === 0 ? (
              <p className="text-gray-500">No paid sales yet.</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-3xl font-black mb-6">Categories</h2>

            {categoryData.length === 0 ? (
              <p className="text-gray-500">No category data yet.</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-3xl font-black mb-6">Recent Orders</h2>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500">No recent orders yet.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-black text-lg">
                        {order.customer?.name || "Customer"}
                      </h3>

                      <p className="text-gray-500">{order.customer?.phone}</p>
                    </div>

                    <div>
                      <p className="font-black">GH₵ {order.total}</p>

                      <p className="text-sm text-gray-500">
                        {order.deliveryStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-black text-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-3xl font-black mb-5">Business Insights</h2>

            <div className="space-y-4 text-white/80">
              <p>Revenue: GH₵ {stats.sales}</p>
              <p>Total Orders: {stats.orders}</p>
              <p>Customers: {stats.customers}</p>
              <p>Products Listed: {stats.products}</p>
              <p>Vendors Registered: {stats.vendors}</p>
              <p>Pending Vendors: {stats.pendingVendors}</p>
              <p>Pending Deliveries: {stats.pending}</p>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              {stats.pendingVendors > 0 && (
                <Link
                  to="/admin/vendors"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-black text-center"
                >
                  Review Vendor Applications
                </Link>
              )}

              <Link
                to="/admin/vendor-payouts"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-black text-center"
              >
                Open Vendor Payouts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}